import { AvatarCard } from "./avatar-card"
import { Button } from "./ui/button"
import { Toggle } from "./ui/toggle"
import { useState, useEffect } from "react"
import { useStore } from "@nanostores/react"
import { 
	type User,
	NullUser,
	loggedIn,
	my_username,
	api
} from "./auth-store"
import { API_URL } from "./utils"

export default function UserProfileBar(props: {}) {
	const [followed, setFollowed] = useState(false)
	const [user, setUser] = useState<User>(NullUser)
	const $loggedIn = useStore(loggedIn)
	const $my_username = useStore(my_username)

	useEffect(() => {
		let urlSearchParams = new URLSearchParams(window.location.search);
		let params = Object.fromEntries(urlSearchParams.entries());

		let userid: string;
		api.get(`${API_URL}/username/${params.user}`)
		.then((res) => {
			setUser({
				username: res.data.user.username,
				name: res.data.user.name,
				id: res.data.user._id
			})
			userid = res.data.user._id
		}).catch((e) => {
			console.log(e.response.data.error);
		})
	}, [])

	return <div className="flex items-center gap-3">
		<AvatarCard user={user}/>
		<Toggle onPressedChange={(b) => {setFollowed(b)} }>
			{followed ? 'Unfollow' : 'Follow'}
		</Toggle>
		{$loggedIn && $my_username == user.username && <Button variant="outline" onClick={() => {
			async function goHome() {
				//await navigate("/")
			}
			//goHome().then(()=>{auth.logout()})
		}}>
			Logout
		</Button>}
	</div>
}

export function UserPosts() {
	const [postIds, setPostIds] = useState<string[]>([])

	useEffect(() => {
		let urlSearchParams = new URLSearchParams(window.location.search);
		let params = Object.fromEntries(urlSearchParams.entries());

		let userid: string;
		api.get(`${API_URL}/username/${params.user}`)
		.then((res) => {
			userid = res.data.user._id
			api.get(`${API_URL}/userPosts/${userid}`)
			.then((res) => {
				setPostIds(res.data.posts.map((m: any) => {
					return m._id
				}))
			})
		})
	}, [])

	return <div className="w-fit grid grid-cols-1 md:grid-cols-2 self-center gap-1">
		{postIds.map((id: string, key: any) => {
			return <a key={key} href={`/post?id=${id}`} className="post-color w-[95vw] h-[95vw] 
				 md:w-[400px] md:h-[400px] block">
			</a>
		})}
	</div>
}
