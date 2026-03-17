import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from "./ui/avatar"

import {
	type User,
	NullUser,
} from "./auth-store"

export function ProfilePic(props: {user?: User}) {
	return <Avatar className="m-2">
		<AvatarImage src="" />
		<AvatarFallback></AvatarFallback>
	</Avatar>
}

export function AvatarCard(props: {
	className?: string,
	user?: User,
}) {
	let {className, user} = props
	user = user || NullUser

	return <a href="/user" className={"flex items-center justify-start gap-2 " + className}>
		<ProfilePic user={user}/>
		<div className="text-left">
			<p className="-mb-2">{user.username}</p>
			<p><small>{user.name}</small></p>
		</div>
	</a>
}
