"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Link } from "react-router"
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
 
const formSchema = z.object({
  username: z.string(),
  password: z.string(),
})
 
function ProfileForm() {
const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {

  }

  return (
    <div className="flex flex-col min-h-[50vh] h-full w-full items-center justify-center">
      <Card className="w-xs">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username and password to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
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
                        <FormLabel htmlFor="password">Password</FormLabel>
						{/*
                        <Link
						  to="/"
                          className="ml-auto inline-block text-sm underline"
                        >
                          Forgot your password?
                        </Link>
						*/}
                      </div>
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
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default function Register() {
	return <div className="flex flex-col items-center gap-3">
		<ProfileForm/>
	</div>;
}
