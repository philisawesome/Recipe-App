import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from "./ui/avatar"

export function AvatarCard({className}: any) {
	return <div className={"flex items-center justify-start gap-2 " + className}>
		<Avatar className="m-2">
			<AvatarImage src="" />
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>
		<div className="text-left">
			<p className="-mb-2">@linecook</p>
			<p><small>Link Cook</small></p>
		</div>
	</div>
}
