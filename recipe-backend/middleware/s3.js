import pkg from "@aws-sdk/client-s3"
const { S3Client, PutObjectCommand } = pkg
import { fromEnv } from "@aws-sdk/credential-providers"
import { v4 as uuidv4 } from 'uuid';
import { node_env } from "../config.js"

const s3 = new S3Client({
	region: 'us-west-1',
	credentials: fromEnv(),
})

async function uploadFile(file, fileuid) {
	const res = await s3.send(new PutObjectCommand({
		Bucket: "stovetop-recipe-app",
		Body: file.buffer,
		ContentType: file.mimetype,
		ContentEncoding: file.encoding,
		ContentLength: file.size,
		Key: "content/" + fileuid
	}))

	return { 
		statusCode: res.$metadata.httpStatusCode,
		res
	}
}

export async function uploadPhotoS3(req, res, next) {
	if (node_env == "dev") {
		req.body.images = ["505cc571-8f3a-47a8-a307-bff7b4950add"]
		next()
		return
	}
	
	try {
		if (req.file.fieldname != "file") {
			throw `Expected a file but got ${req.file.fieldname}`
		}

		let ext = req.file.mimetype
		if (ext != "image/png" && ext != "image/jpeg") {
			throw `Images must be png or jpg but got ${req.file.mimetype}`
		} 

		const fileuid = uuidv4()
		const s3res = await uploadFile(req.file, fileuid)
		if (s3res.statusCode != 200) {
			return res.status(s3res.statusCode).json({error: s3res})
		}

		req.body.images = [fileuid]
		next()
	} catch (e) {
		res.status(500).json({error: e})
	}
}
