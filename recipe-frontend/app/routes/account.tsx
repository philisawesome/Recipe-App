import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from "../components/ui/avatar"

import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../components/ui/hover-card"

import { Input } from "../components/ui/input"

import { Button } from "../components/ui/button"

import { AvatarCard } from "../components/avatar-card"
import { useState, type ChangeEvent } from "react"

export default function Account() {
	const [changingUsername, setChangingUsername] = useState(false)
	const [username, setUsername] = useState("linkcook")
	const [newUsername, setNewUsername] = useState("linkcook")
	//todo turn into form

	const InputUsername = () => {
		const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
			e.preventDefault()
			setNewUsername(e.currentTarget.value)
			e.preventDefault()
		}
		return <Input 
			type="text" defaultValue={newUsername}
			onChange={handleChange}/>
	}

	return <div className="">
		<h1>Edit Account</h1>
		<div className="flex items-center">
			<HoverCard openDelay={0}>
				<HoverCardTrigger>
					<Avatar className="m-2 w-[4rem] h-[4rem]">
						<AvatarImage src="" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</HoverCardTrigger>
				<HoverCardContent className="w-fit p-1">
					Edit profile photo
				</HoverCardContent>
			</HoverCard>
			<div>
				<p>Change profile photo</p>
				<Input type="file" prefix="yO"/>
			</div>
		</div>
		{ !changingUsername && <Button variant="ghost" className="text-xl" onClick={() => {setChangingUsername(true)}}>
			{username}
		</Button> }
		{ changingUsername && <div className="flex items-center">
			<InputUsername/>
			<Button variant="ghost" className="p-0" asChild
				onClick={
					() => {
						setUsername(newUsername)
						setChangingUsername(false)
					}
				}
			>
				<img src="/check.svg"/>
			</Button>
			<Button variant="ghost" className="p-0" asChild 
				onClick={
					() => {
						setChangingUsername(false)
					}
				}
			>
				<img src="/x.svg"/>
			</Button>
		</div> }
	</div>;
}
