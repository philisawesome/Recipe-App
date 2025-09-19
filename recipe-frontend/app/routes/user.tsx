import { AvatarCard } from "../components/avatar-card"
import { Button } from "../components/ui/button"
import { Search } from "../components/ui/search"
import Post from "../components/post"
import { useAuth } from "../hooks/use-auth"

export default function User() {
	const auth = useAuth()
	console.log(auth.user)
	return <div className="w-screen text-wrap flex flex-col items-center gap-3">
		<div className="w-xl flex flex-col gap-3">
			<div className="flex items-center gap-3">
				<AvatarCard user={auth.user}/>
				<Button variant="ghost">Follow</Button>
			</div>

			<p className="text-sm text-gray-500">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
			<Search className="rounded-full" placeholder="search Link's posts"/>
		</div>

		<div className="w-fit grid grid-cols-2 self-center gap-1">
			<Post/>
			<Post/>
			<Post/>
			<Post/>
		</div>
	</div>;
}
