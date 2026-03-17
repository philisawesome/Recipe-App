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

export default function UserProfileBar(props: {
}) {
	const [followed, setFollowed] = useState(false)
	const [user, setUser] = useState<User>(NullUser)
	const $loggedIn = useStore(loggedIn)
	const $my_username = useStore(my_username)

	useEffect(() => {
		let urlSearchParams = new URLSearchParams(window.location.search);
		let params = Object.fromEntries(urlSearchParams.entries());

		api.get(`${API_URL}/profile/${params.id}`, {
			headers: { 
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		})
		.then((res) => {
			setUser({
				username: res.data.user.username,
				name: res.data.user.name,
				id: res.data.user.id
			})
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
