import { AvatarCard } from "../components/avatar-card";
import { Toggle } from "./ui/toggle";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "./ui/carousel";
import { Skeleton } from "./ui/skeleton";
import { CommentSection } from "./comment";
import { useStore } from '@nanostores/react'
import { type User, NullUser, api, loggedIn, redirect } from "./auth-store";
import { API_URL, getURLParams } from "./utils";
import { id } from "zod/v4/locales";

export type PostData = {
  author: string;
  yourPost: boolean;
  followedAuthor?: boolean;
  image: string;
  liked?: boolean;
  likes: int;
  title: string;
  body: string;
  instructions: [string];
  ingredients: [string];
  summary: string;
  comments?: [any];
};

const defaultData: PostData = {
  author: "",
  yourPost: false,
  followedAuthor: false,
  image: "",
  liked: false,
  likes: 0,
  title: "",
  body: "",
  instructions: [""],
  ingredients: [""],
  summary: "",
};

function UseLoading() {
  const [loading, setLoading] = useState(false);
  const egg = (
    <div>
      {loading && (
        <img
          id="egg"
          className="absolute"
          alt="spinning egg"
          src="/egg.svg"
          width="200px"
        />
      )}
    </div>
  );
  return [setLoading, egg];
}

export default function RecipePost() {
  const [liked, setLiked] = useState(false);

  const [user, setUser] = useState<User>(NullUser);
  const [postData, setPostData] = useState<PostData>(defaultData);

  //carousel pages
  const [apiC, setApiC] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [postId, setPostId] = useState('');

  //const [loading, egg] = UseLoading();

  const [loading, setLoading] = useState(true);
  //delete post
  const $loggedIn = useStore(loggedIn)

  async function apiSetLiked(postId, newLiked: boolean) {
	  api.patch(`${API_URL}/post/${postId}/${newLiked?'':'un'}like`, 
	  	{}, 
		{
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
	  })
  }

  useEffect(() => {
    // Fetch and set numlikes/liked here

    const params = getURLParams();

    try {
	  setPostId(params.id);
      if (id === undefined) {
        throw "Expected post id";
      }

      api
        .get(`${API_URL}/post/${params.id}`, {
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
        })
        .then((res) => {
          const post = res.data.post;
          setPostData({
            ...postData,
            title: post.title,
            author: post.user.username,
            image: post.images,
			likes: post.likes?.length - (res.data.liked ? 1 : 0),
            instructions: post.instructions,
            ingredients: post.ingredients,
            summary: post.content,
			comments: post.comments
          });

    	  setLiked(res.data.liked);

          api
            .get(`${API_URL}/profile/${res.data.post.user._id}`)
            .then((res) => {
              setUser({
                username: res.data.user.username,
                name: res.data.user.name,
                id: res.data.user._id,
              });
              setLoading(false);
            });
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {}
  }, []);
  useEffect(() => {
    if (!apiC) {
      return;
    }
    setCount(apiC.scrollSnapList().length);
    setCurrent(apiC.selectedScrollSnap() + 1);
    apiC.on("select", () => {
      setCurrent(apiC.selectedScrollSnap() + 1);
    });
    apiC.on("reInit", () => {
      setCount(apiC.scrollSnapList().length);
      setCurrent(apiC.selectedScrollSnap() + 1);
    });
  }, [apiC]);
  function USure() {
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    return (
      <div>
        <Button onClick={handleClickOpen}>Delete</Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aira-describedby="alert-dialog-description"
          role="alertdialog"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Deleting this post is irreversible
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleClose();
                deletePost();
              }}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  async function deletePost() {
    setLoading(true);
    const params = getURLParams();
    const postId = params.id;
    try {
      await api.delete(`${API_URL}/post/${postId}`, {
        data: {
          id,
          reason: "user request",
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      redirect.set(`/profile?user=${user.username}`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <h1>
        {loading ? (
          <Skeleton className="h-10 w-[400px] rounded-full" />
        ) : (
          postData.title
        )}
      </h1>
      <AvatarCard user={user} />
      <div className="flex items-center gap-2 mb-5">
		{$loggedIn && <Toggle
		  pressed={liked} 
          onPressedChange={(b) => {
            setLiked(b);
			apiSetLiked(postId, b);
          }}
        >
          Like
        </Toggle>}
		{/*todo*/}
        <div>{postData.likes + (liked ? 1 : 0)} likes</div>
      </div>
      <div className="w-full">
        <Carousel setApi={setApiC} className="w-full">
          <CarouselContent>
            {Array.from(postData.image).map((img, key) => (
              <CarouselItem key={key}>
                {img && !loading ? (
                  <img
                    alt="recipe"
                    className="w-full aspect-square object-cover rounded-xl"
                    src={img}
                  />
                ) : (
                  <Skeleton className="h-[400px] w-full rounded-xl" />
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="py-2 text-center text-sm text-muted-foreground">
          {current} of {count}
        </div>
      </div>

      <div className="w-full justify-between flex flex-col p-2 mt-2 gap-3">
        <div className="rounded-sm w-fit">
          <h2>Ingredients</h2>
          {loading ? (
            <Skeleton className="h-10 w-md rounded-full" />
          ) : (
            <ul className="">
              {postData.ingredients.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2>Instructions</h2>
          {loading ? (
            <Skeleton className="h-10 w-md rounded-full" />
          ) : (
            <ol className="list-decimal">
              {postData.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          )}
        </div>
        <div>
          {postData.summary ? <h2>Description</h2> : <></>}
          {loading ? (
            <Skeleton className="h-10 w-md rounded full" />
          ) : (
            <p>{postData.summary}</p>
          )}
        </div>
		<CommentSection comments={postData.comments || []}></CommentSection>
        <USure></USure>
      </div>
    </div>
  );
}
