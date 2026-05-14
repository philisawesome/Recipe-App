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
import { Skeleton } from "../components/ui/skeleton"
import { 
	type User,
	NullUser,
	api,
} from "./auth-store"
import { API_URL, getURLParams } from "./utils"

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

function UseLoading() {
	const [loading, setLoading] = useState(false)
	const egg = (<div>{loading && <img id="egg" className="absolute" alt="spinning egg" src="/egg.svg" width="200px"/>}</div>)
	return [setLoading, egg]
}

export default function RecipePost() {
	const [numLikes, setNumLikes] = useState(0)
	const [liked, setLiked] = useState(false)

	const [user, setUser] = useState<User>(NullUser)
	const [postData, setPostData] = useState<PostData>(defaultData)

	//const [loading, egg] = UseLoading();

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// Fetch and set numlikes/liked here
		setNumLikes(69)
		setLiked(false)

		const params = getURLParams()

		try {
			let id = params.id
			if (id === undefined) {
				throw "Expected post id"
			}

			api.get(`${API_URL}/post/${id}`)
			.then((res) => {
				const post = res.data.post
				setPostData({
					...postData,
					title: post.title,
					author: post.user.username,
					image: post.images[0],
					instructions: post.instructions,
					ingredients: post.ingredients,
				})

				api.get(`${API_URL}/profile/${res.data.post.user._id}`)

				.then((res) => {
					setUser({
						username: res.data.user.username,
						name: res.data.user.name,
						id: res.data.user._id
					})
					setLoading(false)
				})
			}).catch((e) => {
				console.log(e)
			})
		} catch (e) {

		}
	}, [])

	return <div className="">
		<h1>{loading ? <Skeleton className="h-10 w-[400px] rounded-full" /> : postData.title}</h1>
		<AvatarCard user={user}/>
		<div className="flex items-center gap-2 mb-5">
			<Toggle onPressedChange={ (b) => {setLiked(b)} }>
				Like
			</Toggle>
			<div>{numLikes + (liked?1:0)} likes</div>
		</div>

		{ postData.image && !loading
			? <img alt="recipe" className="w-md object-contain" src={postData.image }/> 
			: <Skeleton className="h-[200px] w-md rounded-xl" />}

		<div className="w-full justify-between flex flex-col p-2 mt-2 gap-3">
			<div className="rounded-sm w-fit">
				<h2>Ingredients</h2>
				{loading 
					? <Skeleton className="h-10 w-md rounded-full" />
					: <ul className="">
					  {postData.ingredients.map((step, index) => (
						<li key={index} >{step}</li>
					  ))}
					</ul> 
				}
			</div>
			<div>
				<h2>Instructions</h2>
				{loading 
					? <Skeleton className="h-10 w-md rounded-full" />
					: <ol className="list-decimal">
						  {postData.instructions.map((step, index) => (
							<li key={index} >{step}</li>
						  ))}
					  </ol>
				}
			</div>
		</div>
	</div>
}
