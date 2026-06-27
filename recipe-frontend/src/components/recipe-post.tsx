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
} from "../components/ui/carousel";
import { Skeleton } from "../components/ui/skeleton";
import { CommentSection } from "./comment";
import { useStore } from "@nanostores/react";
import { type User, NullUser, api, loggedIn, redirect } from "./auth-store";
import { API_URL, getURLParams } from "./utils";

export type PostData = {
  author: string;
  authorId: string;
  yourPost: boolean;
  likes: number;
  followedAuthor?: boolean;
  image: string;
  liked?: boolean;
  title: string;
  body: string;
  instructions: [string];
  ingredients: [string];
  summary: string;
  days: string;
  hrs: string;
  mins: string;
  serving: string;
  difficulty: string;
  comments?: any[];
};

const defaultData: PostData = {
  author: "",
  authorId: "",
  yourPost: false,
  likes: 0,
  followedAuthor: false,
  image: "",
  liked: false,
  title: "",
  body: "",
  instructions: [""],
  ingredients: [""],
  summary: "",
  days: "",
  hrs: "",
  mins: "",
  serving: "",
  difficulty: "",
  comments: [],
};

type PostActionProps = {
  deletePost: () => Promise<void>;
  user: User;
  loading: boolean;
};

function USure({ deletePost, user, loading }: PostActionProps) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button variant="contained" color="error" onClick={handleClickOpen}>
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
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
            {loading ? "" : "Yes"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function Settings({ deletePost, user, loading }: PostActionProps) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleClickOpen}>...</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
        fullWidth
      >
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <DialogContentText>Manage your post</DialogContentText>
          <USure deletePost={deletePost} user={user} loading={loading} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default function RecipePost() {
  // --- liking: using partner's approach (backend tells us if we've already liked) ---
  const [liked, setLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false); // kept from your version, spam-click guard

  const [user, setUser] = useState<User>(NullUser);
  const [postData, setPostData] = useState<PostData>(defaultData);
  const [postId, setPostId] = useState("");

  // carousel
  const [apiC, setApiC] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const $loggedIn = useStore(loggedIn);

  // --- liking: partner's apiSetLiked, with your loading guard added ---
  async function apiSetLiked(postId: string, newLiked: boolean) {
    setLikeLoading(true);
    try {
      await api.patch(
        `${API_URL}/post/${postId}/${newLiked ? "" : "un"}like`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );
      setLiked(newLiked);
      setNumLikes((prev) => prev + (newLiked ? 1 : -1));
    } catch (e) {
      console.error(e);
    } finally {
      setLikeLoading(false);
    }
  }

  useEffect(() => {
    const params = getURLParams();

    try {
      const id = params.id;
      if (id === undefined) {
        throw "Expected post id";
      }
      setPostId(id);

      api
        .get(`${API_URL}/post/${id}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          const post = res.data.post;

          setPostData({
            ...postData,
            title: post.title,
            author: post.user.username,
            authorId: post.user._id,
            image: post.images,
            // partner's approach: backend already tells us if liked,
            // so we don't double count it here
            likes: post.likes?.length - (res.data.liked ? 1 : 0),
            instructions: post.instructions,
            ingredients: post.ingredients,
            summary: post.content,
            days: post.days,
            hrs: post.hrs,
            mins: post.mins,
            serving: post.serving,
            difficulty: post.difficulty,
            comments: post.comments,
          });

          setLiked(res.data.liked);
          setNumLikes(post.likes?.length || 0);

          api.get(`${API_URL}/profile/${post.user._id}`).then((res) => {
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
    if (!apiC) return;
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

  async function deletePost() {
    setLoading(true);
    const params = getURLParams();
    const id = params.id;
    try {
      await api.delete(`${API_URL}/post/${id}`, {
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
      <div className="text-center flex flex-col items-center">
        <h1>
          {loading ? (
            <Skeleton className="h-10 w-[400px] rounded-full" />
          ) : (
            postData.title
          )}
        </h1>
        <AvatarCard user={user} />
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
        <div className="flex justify-center gap-2 mt-2">
          {Array.from(postData.image).map((img, key) => (
            <img
              key={key}
              src={img}
              onClick={() => apiC?.scrollTo(key)}
              className="w-14 h-14 object-cover rounded-lg cursor-pointer"
            />
          ))}
        </div>
        <div className="py-2 text-center text-sm text-muted-foreground">
          {current} of {count}
        </div>
      </div>

      <div className="flex justify-center py-4">
        <div className="px-10 border-r border-gray-200 text-center">
          <div className="text-2xl font-medium">
            {postData.days != "0" && postData.hrs != "0" && postData.mins != "0"
              ? `${postData.days}d ${postData.hrs}h ${postData.mins}m`
              : postData.hrs != "0" &&
                  postData.days != "0" &&
                  postData.mins == "0"
                ? `${postData.days}d ${postData.hrs}h`
                : postData.days != "0" &&
                    postData.hrs == "0" &&
                    postData.mins == "0"
                  ? `${postData.days}d`
                  : postData.hrs != "0" &&
                      postData.mins != "0" &&
                      postData.days == "0"
                    ? `${postData.hrs}h ${postData.mins}m`
                    : postData.hrs != "0" &&
                        postData.mins == "0" &&
                        postData.days == "0"
                      ? `${postData.hrs}h`
                      : `${postData.mins}m`}
          </div>
          <div className="text-xs uppercase tracking-wide text-gray-400">
            Time
          </div>
        </div>
        <div className="px-10 border-r border-gray-200 text-center">
          <div className="text-2xl font-medium">{`${postData.serving}`}</div>
          <div className="text-xs uppercase tracking-wide text-gray-400">
            Serves
          </div>
        </div>
        <div className="px-10 text-center">
          <div className="text-2xl font-medium">{postData.difficulty}</div>
          <div className="text-xs uppercase tracking-wide text-gray-400">
            Level
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5 border-gray-350 border-y px-4 py-3">
        {$loggedIn && (
          <Toggle
            pressed={liked}
            disabled={likeLoading}
            className="rounded-full border px-4 py-2"
            onPressedChange={(b) => {
              apiSetLiked(postId, b);
            }}
          >
            Like
          </Toggle>
        )}
        <div>{numLikes} likes</div>
        <div>
          {user.id === postData.authorId ? (
            <Settings deletePost={deletePost} user={user} loading={loading} />
          ) : null}
        </div>
      </div>

      <div className="text-center">
        {loading ? (
          <Skeleton className="h-10 w-md rounded-full" />
        ) : (
          <p className="font-serif italic">{postData.summary}</p>
        )}
      </div>

      <div className="w-full justify-between flex flex-col p-2 my-6 gap-3">
        <div className="w-full">
          <h2 className="mb-2">Ingredients</h2>
          {loading ? (
            <Skeleton className="h-10 w-full rounded-full" />
          ) : (
            <div className="bg-[#FBF4E8] rounded-xl p-4">
              {postData.ingredients.map((step, index) => (
                <div className="flex items-center gap-3" key={index}>
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#D85A30] m-2"
                  />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="my-6">
          <h2 className="mb-2">Instructions</h2>
          {loading ? (
            <Skeleton className="h-10 w-md rounded-full" />
          ) : (
            <div className="flex-row items-center gap-4">
              {postData.instructions.map((step, index) => (
                <div className="flex gap-3 mb-2" key={index}>
                  <div className="rounded-full bg-[#D85A30] text-white flex items-center justify-center w-7 h-7 shrink-0">
                    {index + 1}
                  </div>
                  <div>{step}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <CommentSection comments={postData.comments || []} />
      </div>
    </div>
  );
}
