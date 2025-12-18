"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { type User } from "./utils"
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"

const formSchema = z.object({
	username: z.string().regex(/^[a-z0-9_]{3,20}$/, {
		message: "3-20 chars (a-z, 0-9, _ only).",
	}),
	email: z.email().nonempty(),
	name: z.string().nonempty({
		message: "Must include name"}
	).regex(/^[a-z]{1,12}$/, {
		message: "Name must be 1-12 chars (a-z only).",
	}),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters.",
	}).regex(/[A-Z[!@#$%^&*()\-_=+[{\]]/, {
		message: "Must contain 1 uppercase letter and 1 special character",
	}).regex(/[A-Z]/, {
		message: "Must contain 1 uppercase letter",
	}).regex(/[!@#$%^&*()\-_=+[{\]}\\|;:'",.<>/?`~]/, {
		message: "Must contain 1 special character",
	}),
	confirmpassword: z.string()
}).refine((f) => f.password === f.confirmpassword, {
	message: "Passwords must match",
	path: ["confirmpassword"],
})
 
export default function SignupForm() {	
	//const auth = useAuth()
	const [dialogOpen, setDialogOpen] = useState(false)
	const [dialogText, setDialogText] = useState("")
	const [pwHidden, setPwHidden] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: '',
			email: '',
			password: '',
			confirmpassword: '',
			name: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		return alert("logging in")
		axios.post('http://localhost:4000/api/auth/register', 
			{
				username: values.username,
				email: values.email,
				password: values.password,
				name: values.name,
			}
		).then((res) => {
			console.log(res)
			const user: User = {
				username: res.data.user.username,
				name: res.data.user.name,
			}
			//auth.login(res.data.access_token, user)
			//navigate("/user/"+user.username)
		}).catch((e)=>{
			if (e.response && e.response.data.error) {
				setDialogOpen(true)
				setDialogText(e.response.data.error)
			}
		})
	}

	return (<div className="flex flex-col 
		min-h-[50vh] h-full w-full items-center justify-center">
		<AlertDialog open={dialogOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
				<AlertDialogTitle>Couldn't sign up</AlertDialogTitle>
				<AlertDialogDescription>{dialogText}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogAction
						onClick={() => setDialogOpen(false)}
					>
						Cancel
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>

      <Card className="w-[90vw] md:w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
			Create an account to create and like recipes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
				<FormField
				  control={form.control}
				  name="name"
				  render={({ field }) => (
					<FormItem className="grid gap-2">
					  <FormLabel htmlFor="name">Name</FormLabel>
					  <FormControl>
						<Input
						  id="name"
						  placeholder="John"
						  {...field}
						/>
					  </FormControl>
					  <FormMessage />
					</FormItem>
				  )}
				/>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="username">Username</FormLabel>
                      <FormControl>
                        <Input
                          id="username"
                          placeholder="Enter a unique username"
                          type="username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="Enter your email"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <FormLabel htmlFor="password">
							Password (Min 8 characters)
							<Button variant='link' type="button" onClick={() => {
								setPwHidden(!pwHidden)
							}}>
								Show
							</Button>
						</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          id="password"
                          placeholder="Password"
						  type={pwHidden ? '' : 'password'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmpassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <FormLabel htmlFor="confirmpassword">Confirm Password</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          id="confirmpassword"
                          placeholder="Confirm password"
						  type={pwHidden ? '' : 'password'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" 
					onClick={() => {
					}}
					className="w-full">
                  Sign up 
                </Button>
              </div>
            </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Button asChild variant="link">
				<a href="/login">
					Login
				</a>
			</Button>
          </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
