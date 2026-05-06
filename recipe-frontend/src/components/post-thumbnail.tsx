import { getImgSrc } from "./utils"

export type PostThumbnail = {
	postId: string
	imageUrl: string
}

export default function PostThumbnail(props: PostThumbnail) {
	const {postId, imageUrl} = props

	return <a href={`/post?id=${postId}`} className="block">
		<img 
			alt="recipe thumbnail"
		 	className="object-cover w-[95vw] h-[95vw]
			md:w-[400px] md:h-[400px]" 
			src={getImgSrc(imageUrl)}/>
	</a>
}
