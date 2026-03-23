import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from "./ui/avatar"

import {
	type User,
	NullUser,
} from "./auth-store"

import {
	S3_URL
} from "./utils"

export function ProfilePic(props: {user?: User}) {
	const avatarimg = "blank.jpg" //props.user?.username+".jpg" || "blank.jpg"
	return <Avatar className="m-2">
		<AvatarImage src={`${S3_URL}/content/avatars/${avatarimg}`}/>
		<AvatarFallback></AvatarFallback>
	</Avatar>
}

export function AvatarCard(props: {
	className?: string,
	user?: User,
}) {
	let {className, user} = props
	user = user || NullUser

	return <a href={`/profile?user=${user.username}`} className={"flex items-center justify-start gap-2 " + className}>
		<ProfilePic user={user}/>
		<div className="text-left">
			<p className="-mb-2">{user.username}</p>
			<p><small>{user.name}</small></p>
		</div>
	</a>
}
