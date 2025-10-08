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
	liked?: boolean
	title: string
	body: string
}

export default function RecipePost(props: {data: PostData}) {
	const post = props.data
	const [numLikes, setNumLikes] = useState(0)
	const [liked, setLiked] = useState(false)
	useEffect(() => {
		// Fetch and set numlikes/liked here
		setNumLikes(69)
		setLiked(false)
	}, [])

	return <div>
			<div className="w-full flex items-center gap-2">
				<h1>{post.title}</h1>
			</div>
			<AvatarCard className="mb-3"/>
			<div className="flex items-center gap-2">
				<Toggle onPressedChange={ (b) => {setLiked(b)} }>
					Like
				</Toggle>
				<p>{numLikes + (liked?1:0)} likes</p>
			</div>
		</div>
		{/*
		<Carousel className="w-full md:w-1/2">
			<CarouselContent className="md:h-[20rem] lg:h-[30rem]">
				<CarouselItem className="h-full flex">
					<img className="w-full object-contain" src="https://www.allrecipes.com/thmb/ssGwvBmMa2Mpfjw6vtjGMK8S3Rc=/0x512/filters:no_upscale():max_bytes(150000):strip_icc()/51535-fresh-southern-peach-cobbler-ddmfs-0652-3x4-1-b34274d227264edabd5e6fb115ba0eab.jpg"/>
				</CarouselItem>
				<CarouselItem className="h-full flex">
					<img className="w-full object-contain" src="https://homegrownhappiness.com/wp-content/uploads/2024/01/sourdough-peach-cobbler-recipe-biscuits.jpg"/>
				</CarouselItem>
			</CarouselContent>
			<CarouselPrevious/>
			<CarouselNext/>
		</Carousel>
		*/}
		<div className="w-xl mt-12 grid grid-cols-2 text-sm">
		   	<div className="col-span-2">{post.body}</div>
			{/*
			{auth.loggedIn && <div className="col-span-2 flex flex-col gap-2 mt-10">
				<Textarea className="col-span-2" placeholder="write a comment..."/>
				<Button className="w-fit self-end" variant="secondary">Comment</Button>
			</div>}
			*/}
		</div>
}
