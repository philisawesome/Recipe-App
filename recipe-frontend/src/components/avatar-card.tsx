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

	return <a href={`/profile?user=${user.username}`} className={"flex items-center justify-start gap-4 " + className}>
		<ProfilePic user={user}/>
		<div className="text-left flex flex-col gap-0">
			<p className="-m-1">{user.username}</p>
			{user.name && <p className="-m-1"><small>{user.name}</small></p>}
		</div>
	</a>
}
