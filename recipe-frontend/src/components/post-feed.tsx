import axios from "axios";
import Scroll from "./ui/infinite-scroll";

import { atom } from "nanostores";
import { loggedIn, api } from "./auth-store";
import { useStore } from "@nanostores/react";

import Post from "./post-thumbnail.tsx";
import { EmptyPostThumb } from "./post-thumbnail.tsx";
import type { PostThumbnail } from "./post-thumbnail.tsx";

import { API_URL } from "./utils";
import { useState, useEffect } from "react";

const activeTab = atom<string>("feed");

function PostsDiscover() {
  const [postsDiscover, setPostsDiscover] = useState<PostThumbnail[]>([]);
  const [growingArr, setGrowingArr] = useState<PostThumbnail[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [excludedID, setExcludedID] = useState<String[]>([]);

  useEffect(() => {
    api
      .post(
        `${API_URL}/postDiscover`,
        { excludedID },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .then((res) => {
        setPostsDiscover(res.data.posts);
        const exIDs = res.data.posts.map((p) => {
          return p._id;
        });
        setExcludedID((prev) => [...prev, ...exIDs]);

        setGrowingArr((prev) => [...prev, ...res.data.posts]);
        setHasMore(res.data.hasMore);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [refreshKey]);

  function fetchMore() {
    console.log(hasMore);
    if (hasMore) {
      setRefreshKey((k) => k + 1);
    }
  }

  return (
    <div>
      <Scroll
        fetchMore={fetchMore}
        hasMore={hasMore}
        data={growingArr}
        renderItem={RenderItem}
      ></Scroll>
    </div>
  );
}

function UserPostsFeed() {
  const [posts, setPosts] = useState<PostThumbnail[]>([]);
  const [growingArr, setGrowingArr] = useState<PostThumbnail[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    api
      .get(`${API_URL}/posts`, {
        params: {
          skip,
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setPosts(res.data.posts);
        setGrowingArr((prev) => [...prev, ...res.data.posts]);
        setHasMore(res.data.hasMore);

        console.log("this is skip " + skip);
      })
      .catch(() => setPosts([]));
  }, [skip, refreshKey]);
  function fetchMore() {
    if (hasMore) {
      setSkip(skip + 10);
    } else {
      setRefreshKey((k) => k + 1);
    }
  }
  return (
    <div>
      <Scroll
        data={growingArr}
        fetchMore={fetchMore}
        hasMore={hasMore}
        renderItem={RenderItem}
      ></Scroll>
    </div>
  );
}
function RenderItem(post: PostThumbnail, k: number) {
  return (
    <div className="mt-3 w-full" key={k}>
      <div
        className="grid grid-rows-1 
			gap-3
			md:grid-rows-2 md:gap-1
			justify-items-center
			2xl:grid-rows-3"
      ></div>
      <Post
        postId={post._id}
        imageUrl={post.images[0]}
        author={post.user.username}
        avatar={post.user.avatar}
        title={post.title}
        summary={post.content}
        likes={post.likes?.length ?? 0}
      ></Post>
    </div>
  );
}

export function PostsFeed(props: { posts: PostThumbnail[]; title?: string }) {
  const { posts, title } = props;
  return (
    <div className="mt-3 w-full">
      <div
        className="grid grid-rows-1 
			gap-3
			md:grid-rows-2 md:gap-1
			justify-items-center
			2xl:grid-rows-3"
      >
        {posts.map((p, k) => {
          return (
            <Post
              key={k}
              postId={p.postId}
              imageUrl={p.imageUrl}
              author={p.author}
              avatar={p.avatar}
              title={p.title}
              summary={p.summary}
              likes={p.likes}
            />
          );
        })}
      </div>
    </div>
  );
}

export function FeedTabs() {
  const $loggedIn = useStore(loggedIn);
  const $tab = useStore(activeTab);

  return (
    <div
      className="sticky z-30 bg-[var(--background)] flex gap-4 pt-3"
      style={{ top: "var(--navbar-height)" }}
    >
      {$loggedIn ? (
        <>
          <button
            className={`cursor-pointer pb-1 px-8 py-4 ${$tab === "feed" ? "border-b-2 border-[var(--maroon)] text-[var(--maroon)]" : ""}`}
            onClick={() => activeTab.set("feed")}
          >
            Your Feed
          </button>
          <button
            className={`cursor-pointer pb-1 px-8 py-4 ${$tab === "discover" ? "border-b-2 border-[var(--maroon)] text-[var(--maroon)]" : ""}`}
            onClick={() => activeTab.set("discover")}
          >
            Discover
          </button>
        </>
      ) : (
        <button
          className="cursor-pointer px-8 py-4 pb-1 border-b-2 border-[var(--maroon)] text-[var(--maroon)]"
          onClick={() => activeTab.set("discover")}
        >
          Discover
        </button>
      )}
    </div>
  );
}

export function FeedContent() {
  const $loggedIn = useStore(loggedIn);
  const $tab = useStore(activeTab);

  return (
    <div className="flex flex-col items-center w-full">
      {$tab === "feed" && $loggedIn ? <UserPostsFeed /> : <PostsDiscover />}
    </div>
  );
}
