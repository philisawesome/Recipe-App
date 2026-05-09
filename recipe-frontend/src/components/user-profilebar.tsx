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
import { API_URL, getURLParams } from "./utils"
import type PostThumbnail from "./post-thumbnail.tsx"
import Post from "./post-thumbnail.tsx"


export default function UserProfileBar(props: {}) {
	const [followed, setFollowed] = useState(false)
	const [user, setUser] = useState<User>(NullUser)
	const $loggedIn = useStore(loggedIn)
	const $my_username = useStore(my_username)

	useEffect(() => {
		let params = getURLParams()

		api.get(`${API_URL}/username/${params.user}`, {
			params: {follower_username: $my_username}
		})
		.then((res) => {
			setUser({
				username: res.data.user.username,
				name: res.data.user.name,
				id: res.data.user._id
			})
			setFollowed(res.data.following)
		}).catch((e) => {
			console.log(e.response.data.error);
		})
	}, [])

	return <div className="flex items-center gap-5">
		<AvatarCard user={user}/>
		{($loggedIn && $my_username === user.username) && 

			<Button variant="outline" onClick={() => {
				async function goHome() {
					//await navigate("/")
				}
				//goHome().then(()=>{auth.logout()})
			}}>
				Logout
			</Button>
		|| 
			<Button
				variant="outline"
				onClick={() => {
					if (!followed) {
						api.post(`${API_URL}/profile/${user.id}/follow`, {},
						{
							headers: {
								'Authorization': `Bearer ${localStorage.getItem('token')}`,
							}
						})
						.then((res) => {
							if (res.status === 200) {
								setFollowed(!followed)
							}
						}).catch((e) => {
							console.log(e);
						})
					} else {
						api.delete(`${API_URL}/profile/${user.id}/unfollow`, {
							headers: {
								'Authorization': `Bearer ${localStorage.getItem('token')}`,
							}
						})
						.then((res) => {
							if (res.status === 200) {
								setFollowed(!followed)
							}
						}).catch((e) => {
							console.log(e);
						})
					}
				}}
			>
				{followed ? 'Unfollow' : 'Follow'}
			</Button>
		}
	</div>
}

export function UserPosts() {
	const [postIds, setPostIds] = useState<PostThumbnail[]>([])

	useEffect(() => {
		const params = getURLParams()

		let userid: string;
		api.get(`${API_URL}/username/${params.user}`)
		.then((res) => {
			userid = res.data.user._id
			api.get(`${API_URL}/userPosts/${userid}`)
			.then((res) => {
				setPostIds(res.data.posts.map((m: any) => {
					return{postId: m._id, imageUrl: m.images[0]}
				}))
			})
		})
	}, [])

	return <div className="w-fit grid grid-cols-1 md:grid-cols-2 self-center gap-1">
				{postIds.map((p,id)=>{
					return <Post key={id}
						postId = {p.postId}
						imageUrl = {p.imageUrl}>
					</Post>
				})
				}

				
			

	</div>
}
