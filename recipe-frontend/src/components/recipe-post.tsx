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

import { api } from "./auth-store"
import { API_URL } from "./utils"

export type PostData = {
	author: string
	yourPost: boolean,
	followedAuthor?: boolean
	image: string,
	liked?: boolean
	title: string
	body: string
	instructions: [string]
	ingredients: [string]
}

const defaultData: PostData = {
	author: "",
	yourPost: false,
	followedAuthor: false,
	image: "",
	liked: false, 
	title: "",
	body: "",
	instructions: [""],
	ingredients: [""]
}

export default function RecipePost() {
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

			api.get(`${API_URL}/post/${id}`,
				{
					headers: { 
						'Authorization': 'Bearer ' + localStorage.getItem('token')
					}
				}
			).then((res) => {
				const post = res.data.post
				setPostData({
					...postData,
					title: post.title,
					author: post.user.username,
					image: "https://stovetop-recipe-app.s3.us-west-1.amazonaws.com/content/" + post.images[0],
					instructions: post.instructions,
					ingredients: post.ingredients,
				})
			})
		} catch (e) {

		}
	}, [])

	return <div className="">
		<h1>{postData.title}</h1>
		<AvatarCard className=""/>
		<div className="flex items-center gap-2 mb-5">
			<Toggle onPressedChange={ (b) => {setLiked(b)} }>
				Like
			</Toggle>
			<p>{numLikes + (liked?1:0)} likes</p>
		</div>
		<img className="w-md object-contain" src={postData.image}/>
		<div className="w-full justify-between flex items-center">
			<div className="rounded-sm w-fit p-2">
				<h2>Ingredients</h2>
				<ul className="">
				  {postData.ingredients.map((step, index) => (
					<li key={index} >{step}</li>
				  ))}
				</ul>
			</div>
			<div>
				<h2>Instructions</h2>
				<ol className="list-decimal">
				  {postData.instructions.map((step, index) => (
					<li key={index} >{step}</li>
				  ))}
				</ol>
			</div>
		</div>
	</div>
}
