import { useState, useRef, useEffect } from "react"
import { redirect, loggedIn } from './auth-store'
import { useStore } from '@nanostores/react'
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import List from "./list"

import { api } from "./auth-store"
import { API_URL } from "./utils"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"

// Page for authenticated users to create and post recipes
//
// Todo: Discuss what makes up a post and how to validate fields
// (e.g. fields: recipe summary, ingredients list, steps, etc.;
// validation: ingredient validation?, empty fields, etc.)

// For the Form components, see the Input component page of the Shadcn website. Refer to the the Form example code.

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { z } from "zod"
const FormSchema = z.object({
	recipeTitle: z.string().min(2, {
		message: "Recipe name must be at least 2 characters.",
	}),
	photo: z.any(),
	summary: z.string().max(200, {
		message: "Summary can't be more than 200 characters",
	}),
})

export default function NewPost() {
	const [photo, setPhoto] = useState<File | null>()
	const fileInputRef = useRef<any>(null);
	const [ingreds, setIngreds] = useState<string[]>([
		"carrots",
		"broccoli",
		"chicken",
	])
	const [steps, setSteps] = useState<string[]>([
		"First you gotta boil the chickn",
		"Then cut the chicken",
		"Serve with rice",
	])
	const $loggedIn = useStore(loggedIn)

	useEffect(() => {
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}, [])

	useEffect(() => {
		if (!$loggedIn) {
			redirect.set('/login')
		}
	}, [$loggedIn])

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			recipeTitle: "",
			photo: undefined,
			summary: "",
		},
	})

	function handlePost(formData: z.infer<typeof FormSchema>) {
		// Validate and send POST request here
		try {
			api.post(`${API_URL}/posts`,
				{
					file: photo,
					title: formData.recipeTitle,
					content: formData.summary,
					ingredients: ingreds,
					instructions: steps,
				},
				{
					headers: { 
						'Content-Type': 'multipart/form-data',
						'Authorization': 'Bearer ' + localStorage.getItem('token')
					}
				}
			)
		} catch (e) {
			console.log(e)
		}
	}
		

	return <div 
		className="border-2 w-lg gap-4
		p-4 rounded-lg border-solid 
		flex flex-col items-center"
	>
		<h1>Create a new recipe</h1>

		{ /* Each div in form separates fields */ }
		<Form {...form}>
			<form 
				encType="multipart/form-data"
				className="mt-4 flex flex-col w-full gap-7"
				onSubmit={form.handleSubmit(handlePost)}>
				<FormField
					control={form.control}
					name="recipeTitle"
					render={({field}) => (
						<FormItem>
							<FormLabel>Recipe name</FormLabel>
							<FormControl>
							<Input 
								type="text" 
								placeholder="Peach cobber"  
								{...field}/>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>

				{/* Not using {field} below because it doesn't support file types. Using a clunky workaround with react state */}
				<FormField
					control={form.control}
					name="photo"
					render={() => (
						<FormItem>
							<FormLabel>Add a photo</FormLabel>
							<FormControl>

							<input 
								className="text-sm 
								outline-1
								p-2 rounded-sm"
								name="photo"
								type="file"
								ref={fileInputRef}
								onChange={(e) => {
									if (e.target.files && e.target.files.length > 0) {
										setPhoto(e.target.files[0])
									}
							}}/>

							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>

				<List 
					title="Ingredients"
					items={ingreds}
					setItems={setIngreds}
				/>

				<List 
					title="Instructions"
					items={steps}
					setItems={setSteps}
					ordered={true}
					textbox={true}
				/>

				<FormField
					control={form.control}
					name="summary"
					render={({field}) => (
						<FormItem>
							<FormLabel>Description (optional)</FormLabel>
							<FormControl>
								<Textarea 
									className="resize-none"
									placeholder="A summery peach cobbler..."
									{...field}/>
							</FormControl>
							<FormMessage/>
						</FormItem>
					)}
				/>

				<Button 
					className="bg-(--color-1) w-fit"
					type="submit" 
					value="submit">
					Post
				</Button>
			</form>
		</Form>
	</div>;
}
