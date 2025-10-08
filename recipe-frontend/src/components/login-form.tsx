import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
 
const formSchema = z.object({
	username: z.string(),
	password: z.string(),
})
 
function LoginForm() {
	const [loginFailed, setLoginFailed] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: '',
			password: '',
		},
  	})

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
				<form onChange={()=>setLoginFailed(false)} className="space-y-8">
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
				<Button asChild variant="link">
					<a href="/signup">
						Sign up
					</a>
				</Button>
			</div>
			</CardContent>
		</Card>
	</div>)
}

export default function Login() {
	return <div className="flex flex-col items-center gap-3 w-full z-1">
		<LoginForm/>
	</div>;
}
