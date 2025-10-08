import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from "./ui/avatar"

import { Button } from "./ui/button"

import {
	type User,
	MockUser,
} from "../../app/lib/utils"

export function AvatarCard(props: {
	className?: string,
	user?: User,
}) {
	let {className, user} = props
	user = user || MockUser

	return <a href="/user" className={"flex items-center justify-start gap-2 " + className}>
		<Avatar className="m-2">
			<AvatarImage src="" />
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>
		<div className="text-left">
			<p className="-mb-2">{user.username}</p>
			<p><small>{user.name}</small></p>
		</div>
	</a>
}
