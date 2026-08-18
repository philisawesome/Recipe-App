import { useState, useRef, useEffect } from "react";
import { redirect, loggedIn } from "./auth-store";
import { useStore } from "@nanostores/react";
import { Button } from "./ui/button";

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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { custom, z } from "zod";
const MAX_FILE_SIZE = 5000000;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const FormSchema = z.object({
  photo: z
    .any()
    .optional()
    .refine(
      (files) => {
        if (files == undefined) {
          return true;
        }
        return ACCEPTED_IMAGE_TYPES.includes(files?.type);
      },
      {
        message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
      },
    )
    .refine(
      (files) => {
        if (files == undefined) {
          return true;
        }
        return files?.size <= MAX_FILE_SIZE;
      },
      {
        message: `Max file size is 5MB.`,
      },
    ),
});

export default function NewProfilePic() {
  const paramsString = window.location.search;
  const SearchParams = new URLSearchParams(paramsString);
  const from = SearchParams.get("from");
  const username = localStorage.getItem("username");

  const [loading, setLoading] = useState<boolean>(false);
  const $loggedIn = useStore(loggedIn);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      photo: undefined,
    },
  });
  useEffect(() => {
    if (!$loggedIn) {
      redirect.set("/login");
    }
  }, [$loggedIn]);

  async function handleProfilePic(formData: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      const sendData = new FormData();
      sendData.append("photo", formData?.photo);

      await api.patch(`${API_URL}/profilePic/setProfilePic`, sendData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      redirect.set(`/profile?user=${username}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="border-2 w-full md:w-lg p-4 rounded-lg border-solid flex flex-col
      items-center mx-auto"
    >
      <Form {...form}>
        <form
          encType="multipart/form-data"
          className="mt-4 flex flex-col w-full gap-7"
          onSubmit={form.handleSubmit(handleProfilePic)}
        >
          <FormField
            control={form.control}
            name="photo"
            render={() => (
              <FormItem>
                <FormLabel>Select Profile Picture</FormLabel>
                <FormControl>
                  <input
                    className="text-sm 
								outline-1
								p-2 rounded-sm cursor-pointer"
                    name="photo"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files) {
                        const filesToAdd = e.target.files[0];
                        form.setValue("photo", filesToAdd);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center items-center">
            {from ? (
              <Button
                className="bg-(--color-1) w-fit cursor-pointer"
                onClick={() => {
                  redirect.set(`/profile?user=${username}`);
                }}
              >
                {from == "signup" ? "Skip" : from == "profile" ? "Back" : null}
              </Button>
            ) : null}
            <Button
              className="bg-(--color-1) w-fit cursor-pointer"
              type="submit"
              value="submit"
              disabled={loading}
            >
              {loading ? "Setting..." : "Set"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
