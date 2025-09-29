import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from "./ui/avatar"

import { Button } from "../components/ui/button"
import { Link } from "react-router"

import {
	type User,
	MockUser,
} from "../lib/utils"

export function AvatarCard(props: {
	className?: string,
	user?: User,
}) {
	let {className, user} = props
	user = user || MockUser

	return <Link to={"/user/" + user.username}><div className={"flex items-center justify-start gap-2 " + className}>
		<Avatar className="m-2">
			<AvatarImage src="" />
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>
		<div className="text-left">
			<p className="-mb-2">{user.username}</p>
			<p><small>{user.name}</small></p>
		</div>
	</div>
	</Link>
}
