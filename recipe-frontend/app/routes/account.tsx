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
import { useState, useEffect, type ChangeEvent } from "react"
import { useAuth } from "../hooks/use-auth"

export default function Account() {
	const [changingUsername, setChangingUsername] = useState(false)
	const [username, setUsername] = useState("loading username...")
	const [newUsername, setNewUsername] = useState("")

	const auth = useAuth()

	// I think this is where axios comes in
	async function mockFetch() {
		return {name: "cook"}
	}
	
	// On render, send an http GET to backend route with
	// the auth token for the user's account information
	useEffect(() => {
		const getUserData = async () => {
			try {
				if (!auth.loggedIn) {
					return
				}
				const user = await mockFetch();	
				setUsername(user.name)
			} catch (error) {
				console.log(error)
			}
		}
		getUserData()
	})

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
		{ auth.loggedIn 
			&& <div>Logged in</div>
			|| <div>Not logged in</div>
		}
		{ !changingUsername
			// Not changing username
			&& <Button variant="ghost" className="text-xl" onClick={() => {setChangingUsername(true)}}>
				{username}
			</Button>

			/// Changing username
			|| <div className="flex items-center">
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
			</div>
		}

		{ /* TODO turn into form */}
		<h1 className="mt-8">Edit Account</h1>
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
	</div>;
}
