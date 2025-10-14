import { AvatarCard } from "../../src/components/avatar-card"
import { Button } from "../../src/components/ui/button"
import { Search } from "../../src/components/search"
import { Toggle } from "../../src/components/ui/toggle"
import Post from "../../src/components/post"
import { useAuth } from "../hooks/use-auth"
import { useState } from "react"
import { useNavigate } from "react-router"

export default function User() {
	const auth = useAuth()
	const navigate = useNavigate()

	const [followed, setFollowed] = useState(false)
	return <div className="w-screen text-wrap flex flex-col items-center gap-3">
		<div className="w-screen md:w-xl flex flex-col gap-3 p-5">
			<div className="flex items-center gap-3">
				<AvatarCard user={auth.user}/>
				<Toggle onPressedChange={(b) => {setFollowed(b)} }>
					{followed ? 'Unfollow' : 'Follow'}
				</Toggle>
				<Button variant="outline" onClick={() => {
					async function goHome() {
						await navigate("/")
					}
					goHome().then(()=>{auth.logout()})
				}}>
					Logout
				</Button>
			</div>

			<p className="text-sm text-gray-500">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
			<Search className="rounded-full" placeholder="search Link's posts"/>
		</div>

		<div className="w-fit grid grid-cols-1 md:grid-cols-2 self-center gap-1">
			<Post/>
			<Post/>
			<Post/>
			<Post/>
		</div>
	</div>;
}
