import { useState, useRef, useEffect } from "react";
import { redirect, loggedIn } from "./auth-store";
import { useStore } from "@nanostores/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import List from "./list";

import { api } from "./auth-store";
import { API_URL } from "./utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

// Page for authenticated users to create and post recipes
//
// Todo: Discuss what makes up a post and how to validate fields
// (e.g. fields: recipe summary, ingredients list, steps, etc.;
// validation: ingredient validation?, empty fields, etc.)

// For the Form components, see the Input component page of the Shadcn website. Refer to the the Form example code.

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg"];

const FormSchema = z.object({
  recipeTitle: z.string().min(2, {
    message: "Recipe name must be at least 2 characters.",
  }),
  photo: z
    .array(z.any())
    .min(1)
    .refine(
      (files) => {
        return files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type));
      },
      { message: "Only PNG and JPEG images are allowed." },
    ),

  summary: z.string().max(200, {
    message: "Summary can't be more than 200 characters",
  }),
});

export default function NewPost() {
  const [loading, setLoading] = useState<boolean>(false);
  const [photo, setPhoto] = useState<File[] | null>();
  const fileInputRef = useRef<any>(null);
  const [ingreds, setIngreds] = useState<string[]>([
    "carrots",
    "broccoli",
    "chicken",
  ]);
  const [steps, setSteps] = useState<string[]>([
    "First you gotta boil the chickn",
    "Then cut the chicken",
    "Serve with rice",
  ]);
  const $loggedIn = useStore(loggedIn);

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  useEffect(() => {
    if (!$loggedIn) {
      redirect.set("/login");
    }
  }, [$loggedIn]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      recipeTitle: "",
      photo: undefined,
      summary: "",
    },
  });

  async function handlePost(formData: z.infer<typeof FormSchema>) {
    setLoading(true);
    // Validate and send POST request here
    try {
      console.log(photo);
      const sendData = new FormData();
      for (let i = 0; i < formData.photo.length; i++) {
        sendData.append("photo", formData.photo[i]);
      }
      for (let i = 0; i < ingreds.length; i++) {
        sendData.append("ingredients", ingreds[i]);
      }
      for (let i = 0; i < steps.length; i++) {
        sendData.append("instructions", steps[i]);
      }
      sendData.append("title", formData.recipeTitle);
      sendData.append("content", formData.summary);
      await api.post(`${API_URL}/posts`, sendData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      redirect.set("/");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="border-2 w-lg gap-4
		p-4 rounded-lg border-solid 
		flex flex-col items-center"
    >
      <h1>Create a new recipe</h1>

      {/* Each div in form separates fields */}
      <Form {...form}>
        <form
          encType="multipart/form-data"
          className="mt-4 flex flex-col w-full gap-7"
          onSubmit={form.handleSubmit(handlePost)}
        >
          <FormField
            control={form.control}
            name="recipeTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipe name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Peach cobber" {...field} />
                </FormControl>
                <FormMessage />
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
                    multiple
                    className="text-sm 
								outline-1
								p-2 rounded-sm"
                    name="photo"
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const filesToAdd = e.target.files;
                        let dataArray = [];
                        if (photo) {
                          dataArray = [...photo, ...filesToAdd];
                          form.setValue("photo", photo);
                        } else {
                          dataArray = [...filesToAdd];
                        }
                        setPhoto(dataArray);
                        form.setValue("photo", dataArray);
                      }
                    }}
                  />
                </FormControl>
                {photo &&
                  Array.from(photo).map((p) => {
                    return <p>{p.name}</p>;
                  })}
                <FormMessage />
              </FormItem>
            )}
          />

          <List title="Ingredients" items={ingreds} setItems={setIngreds} />

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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    placeholder="A summery peach cobbler..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="bg-(--color-1) w-fit"
            type="submit"
            value="submit"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
