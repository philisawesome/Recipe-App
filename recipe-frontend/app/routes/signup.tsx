"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { Link } from "react-router"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { type User } from "../lib/utils"
import { useAuth } from "../hooks/use-auth"
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
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
} from "../components/ui/alert-dialog"

const formSchema = z.object({
	username: z.string().min(0, {
		message: "Username must be at least 0 characters.",
	}),
	email: z.email().nonempty(),
	//firstname: z.string(),
	//lastname: z.string(),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters.",
	}),
	confirmpassword: z.string()
}).refine((f) => f.password === f.confirmpassword, {
	message: "Passwords must match",
	path: ["confirmpassword"],
})
 
function ProfileForm() {	
	const auth = useAuth()
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
			//firstname: '',
			//lastname: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		axios.post('http://localhost:4000/api/auth/register', 
			{
				username: values.username,
				email: values.email,
				password: values.password,
				name: 'Bob',
			}
		).then((res) => {
			console.log(res)
			const user: User = {
				username: res.data.user.username,
				name: res.data.user.name,
			}
			auth.login(res.data.access_token, user)
		}).catch((e)=>{
			if (e.response && e.response.data.error) {
				setDialogOpen(true)
				setDialogText(e.response.data.error)
			}
		})
	}

	return (<div className="flex flex-col min-h-[50vh] h-full w-full items-center justify-center">
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

      <Card className="w-xs">
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
				{/*
			  	<div className="flex gap-1">
					<FormField
					  control={form.control}
					  name="firstname"
					  render={({ field }) => (
						<FormItem className="grid gap-2">
						  <FormLabel htmlFor="firstname">First</FormLabel>
						  <FormControl>
							<Input
							  id="firstname"
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
					  name="lastname"
					  render={({ field }) => (
						<FormItem className="grid gap-2">
						  <FormLabel htmlFor="lastname">Last</FormLabel>
						  <FormControl>
							<Input
							  id="lastname"
							  placeholder="Moreno"
							  {...field}
							/>
						  </FormControl>
						  <FormMessage />
						</FormItem>
					  )}
					/>
				</div>
				*/}
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
            <Link to="/login" className="underline">
				Login
            </Link>
          </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
export default function Signup() {
	return <div className="flex flex-col items-center gap-3">
		<ProfileForm/>
	</div>;
}
