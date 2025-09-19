import { Search } from "../components/ui/search"

import Post from "../components/post"

export default function Home() {
	return (<div className="flex flex-col items-center gap-4">
		<h1 className="title title-font">Stovetop</h1>
		<h2 className="-mt-5 text-gray-600">
			<i className="text-md">create and share recipes</i>
		</h2>
		<Search className="rounded-full" placeholder="lemons, sugar"/>

		<div className="w-fit grid grid-cols-2 gap-1 mt-10">
			<Post/>
			<Post/>
			<Post/>
			<Post/>
			<Post/>
			<Post/>
		</div>
	</div>);
}
