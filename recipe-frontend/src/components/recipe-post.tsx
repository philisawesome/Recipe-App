import { AvatarCard } from "../components/avatar-card";
import { Toggle } from "./ui/toggle";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "../components/ui/carousel";
import { Skeleton } from "../components/ui/skeleton";
import { type User, NullUser, api } from "./auth-store";
import { API_URL, getURLParams } from "./utils";

export type PostData = {
  author: string;
  yourPost: boolean;
  followedAuthor?: boolean;
  image: string;
  liked?: boolean;
  title: string;
  body: string;
  instructions: [string];
  ingredients: [string];
  summary: string;
};

const defaultData: PostData = {
  author: "",
  yourPost: false,
  followedAuthor: false,
  image: "",
  liked: false,
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
  const [numLikes, setNumLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const [user, setUser] = useState<User>(NullUser);
  const [postData, setPostData] = useState<PostData>(defaultData);

  //carousel pages
  const [apiC, setApiC] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  //const [loading, egg] = UseLoading();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch and set numlikes/liked here
    setNumLikes(67);
    setLiked(false);

    const params = getURLParams();

    try {
      let id = params.id;
      if (id === undefined) {
        throw "Expected post id";
      }

      api
        .get(`${API_URL}/post/${id}`)
        .then((res) => {
          const post = res.data.post;
          setPostData({
            ...postData,
            title: post.title,
            author: post.user.username,
            image: post.images,
            instructions: post.instructions,
            ingredients: post.ingredients,
            summary: post.content,
          });

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
        <Toggle
          onPressedChange={(b) => {
            setLiked(b);
          }}
        >
          Like
        </Toggle>
        <div>{numLikes + (liked ? 1 : 0)} likes</div>
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
          <h2>Description</h2>
          {loading ? (
            <Skeleton className="h-10 w-md rounded full" />
          ) : (
            <p>{postData.summary}</p>
          )}
        </div>
      </div>
    </div>
  );
}
