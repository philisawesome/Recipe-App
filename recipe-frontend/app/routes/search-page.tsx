import { Link } from "react-router"
import { Search } from "../components/ui/search"

import { Button } from "../components/ui/button"

import Post from "../components/post"

import { Separator } from "../components/ui/separator"

function SearchResult({title, description}: any) {
	return <div><Button variant="ghost" asChild>
		<Link to="/post/1234" className="flex flex-col w-full items-start h-fit">
			<b>{title}</b>
			<p>{description}</p>
		</Link>
	</Button>
	<Separator/>
	</div>
}

const SearchResults = [
	{
		title: "peach cobbler",
		description: "summery peach cobber perfect for parties",
	},
	{
		title: "pbj",
		description: "classic pbj sandwich",
	},
	{
		title: "kangaroo soup",
		description: "australian delicacy",
	},
	{
		title: "airfryer wings",
		description: "crispy wings in the air fryer",
	},
]

export default function SearchPage() {
	return <div>
		<h1 className="mb-4">Search recipes</h1>
		<Search className="rounded-full" placeholder="lemons, sugar"/> 
		<div className="w-xl mt-5">
			{SearchResults.map((s, i) => {
				return <SearchResult
					key = {i}
					title={s.title}
					description={s.description}/>
			})}
		</div>
	</div>
}

