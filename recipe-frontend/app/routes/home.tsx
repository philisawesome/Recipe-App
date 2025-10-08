//import { Search } from "../components/ui/search"

import Post from "../../src/components/post"

export default function Home() {
	return (<div className="flex flex-col items-center gap-4">
		<h1 className="title title-font">Stovetop</h1>
		<h2 className="-mt-5 text-gray-600">
			<i className="text-md">create and share recipes</i>
		</h2>
		{/*<Search className="rounded-full text-xl w-[75vw] md:w-[20rem]" placeholder="lemons, sugar"/>*/}

		<div className="w-fit grid grid-cols-1 
			gap-3
			md:grid-cols-2 md:gap-1
			2xl:grid-cols-3
			mt-10">
			<Post/>
			<Post/>
			<Post/>
			<Post/>
		</div>
	</div>);
	
}
