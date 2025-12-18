import { useState, useRef, useEffect } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import axios from "axios"

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

	useEffect(() => {
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}, [])

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			recipeTitle: "",
			photo: undefined,
			summary: "",
		},
	})

	function validateAndPost(data: any) {
		handlePost(data)
	}

	function handlePost(formData: z.infer<typeof FormSchema>) {
		// Validate and send POST request here
		try {
			axios.post('http://localhost:4000/api/posts',
				{
					file: photo,
					title: formData.recipeTitle,
					content: formData.summary,
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
		className="border-2 w-lg 
		p-4 rounded-lg border-solid "
	>
		<h1>Create a new recipe</h1>

		{ /* Each div in form separates fields */ }
		<Form {...form}>
			<form 
				encType="multipart/form-data"
				className="mt-4 flex flex-col gap-7"
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

				<FormField
					control={form.control}
					name="summary"
					render={({field}) => (
						<FormItem>
							<FormLabel>Summary</FormLabel>
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
