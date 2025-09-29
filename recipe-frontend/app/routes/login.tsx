"use client"

import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Link, useNavigate } from "react-router"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../components/ui/form"
import { Input } from "../components/ui/input"
import { type User } from "../lib/utils"
import { useAuth } from "../hooks/use-auth"
 
const formSchema = z.object({
	username: z.string(),
	password: z.string(),
})
 
function LoginForm() {
	const auth = useAuth()
	const navigate = useNavigate()
	const [loginFailed, setLoginFailed] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: '',
			password: '',
		},
  	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		axios.post('http://localhost:4000/api/auth/login', 
			{
				username: values.username,
				password: values.password,
			}
		).then((res) => {
			const user: User = {
				username: res.data.user.username,
				name: res.data.user.name,
			}
			auth.login(res.data.access_token, user)
			navigate('/user/' + user.username)
		}).catch((e) => {
			setLoginFailed(true)
		})
	}

	return (<div className="flex flex-col 
		min-h-[50vh] h-full w-full items-center justify-center">
		<Card className="w-[90%] md:w-xs">
			<CardHeader>
				<CardTitle className="text-2xl">Login</CardTitle>
				<CardDescription>
					Enter your username and password to login to your account.
				</CardDescription>
			</CardHeader>
			<CardContent>
			<Form {...form}>
				<form onChange={()=>setLoginFailed(false)} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid gap-4">
					{/* Username field */}
					<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem className="grid gap-2">
						<FormLabel htmlFor="username">Username</FormLabel>
						<FormControl>
							<Input
							id="username"
							placeholder="Username"
							type="username"
							{...field}
							/>
						</FormControl>
						<FormMessage/>
						</FormItem>
					)}
					/>
					{/* Password field */}
					<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem className="grid gap-2">
							<FormLabel htmlFor="password">Password</FormLabel>
							<FormControl>
								<Input
								id="password"
								placeholder="Password"
								type="password"
								{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
					/>
					{/* Login button calls the onSubmit function (see <form> element) */}
					<Button type="submit" className="w-full">Login</Button>
					{ loginFailed && 
						<span className="text-red-500 text-xs">
							Could not login. Try again.
						</span> }
				</div>
				</form>
			</Form>
			<div className="mt-4 text-center text-sm">
				Don't have an account?{' '}
				<Link to="/signup" className="underline">Sign up</Link>
			</div>
			</CardContent>
		</Card>
	</div>)
}

export default function Login() {
	return <div className="flex flex-col items-center gap-3 w-full">
		<LoginForm/>
	</div>;
}
