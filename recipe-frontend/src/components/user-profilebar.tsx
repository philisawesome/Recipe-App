import { AvatarCard } from "./avatar-card"
import { Button } from "./ui/button"
import { Toggle } from "./ui/toggle"
import { useState } from "react"

export default function UserProfileBar(props: {
}) {
	const [followed, setFollowed] = useState(false)

	return <div className="flex items-center gap-3">
		<AvatarCard /*user={auth.user}*//>
		<Toggle onPressedChange={(b) => {setFollowed(b)} }>
			{followed ? 'Unfollow' : 'Follow'}
		</Toggle>
		<Button variant="outline" onClick={() => {
			async function goHome() {
				//await navigate("/")
			}
			//goHome().then(()=>{auth.logout()})
		}}>
			Logout
		</Button>
	</div>
}
