import axios from "axios"
import { AvatarCard } from "../components/avatar-card"
import { Toggle } from "./ui/toggle"
import { useState, useEffect } from "react"
import { 
	Carousel, 
	CarouselItem,
	CarouselContent,
	CarouselNext,
	CarouselPrevious,
} from "../components/ui/carousel"

export type PostData = {
	author: string
	yourPost: boolean,
	followedAuthor?: boolean
	image: string,
	liked?: boolean
	title: string
	body: string
}

const defaultData: PostData = {
	author: "",
	yourPost: false,
	followedAuthor: false,
	image: "",
	liked: false, 
	title: "",
	body: ""
}

export default function RecipePost(props: {data: PostData}) {
	const [numLikes, setNumLikes] = useState(0)
	const [liked, setLiked] = useState(false)

	const [postData, setPostData] = useState<PostData>(defaultData)
	useEffect(() => {
		// Fetch and set numlikes/liked here
		setNumLikes(69)
		setLiked(false)


		let urlSearchParams = new URLSearchParams(window.location.search);
		let params = Object.fromEntries(urlSearchParams.entries());
		try {
			let id = params.id
			if (id === undefined) {
				throw "Expected post id"
			}

			axios.get(`http://localhost:4000/api/post/${id}`,
				{
					headers: { 
						'Authorization': 'Bearer ' + localStorage.getItem('token')
					}
				}
			).then((res) => {
				const post = res.data.post
				console.log(post)
				setPostData({
					...postData,
					title: post.title,
					author: post.user.username,
					image: "https://stovetop-recipe-app.s3.us-west-1.amazonaws.com/content/" + post.images[0]
				})
				console.log("https://stovetop-recipe-app.s3.us-west-1.amazonaws.com/content/" + post.images[0])
			})
		} catch (e) {

		}
	}, [])

	return <div className="">
			<div className="w-full flex-col items-center gap-2">
				<h1>{postData.title}</h1>

			</div>
			<AvatarCard className="mb-3"/>
			<div className="flex items-center gap-2">
				<Toggle onPressedChange={ (b) => {setLiked(b)} }>
					Like
				</Toggle>
				<p>{numLikes + (liked?1:0)} likes</p>


			</div>
			<img className="w-md object-contain" src={postData.image}/>
		</div>
		{/*
		{/*
		<div className="w-xl mt-12 grid grid-cols-2 text-sm">
		   	<div className="col-span-2">{post.body}</div>
			{/*
			{auth.loggedIn && <div className="col-span-2 flex flex-col gap-2 mt-10">
				<Textarea className="col-span-2" placeholder="write a comment..."/>
				<Button className="w-fit self-end" variant="secondary">Comment</Button>
			</div>}
			*/}
}
