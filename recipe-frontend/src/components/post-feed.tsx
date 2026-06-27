import axios from "axios";

import { atom } from "nanostores";
import { loggedIn, api } from "./auth-store";
import { useStore } from "@nanostores/react";

import Post from "./post-thumbnail.tsx";
import { EmptyPostThumb } from "./post-thumbnail.tsx";
import type PostThumbnail from "./post-thumbnail.tsx";

import { API_URL } from "./utils";
import { useState, useEffect } from "react";

const activeTab = atom<string>("feed");

function PostsDiscover() {
  const [postsDiscover, setPostsDiscover] = useState<PostThumbnail>(
    Array(3).fill(EmptyPostThumb),
  );

  useEffect(() => {
    api.get(`${API_URL}/postDiscover`).then((res) => {
      setPostsDiscover(
        res.data.posts.map((p) => {
          console.log(p);
          return {
            postId: p._id,
            imageUrl: p.images[0],
            author: p.user.username,
            avatar: p.user.avatar,
            title: p.title,
            summary: p.content,
            likes: p.likes?.length ?? 0,
          };
        }),
      );
    }).catch(() => setPostsDiscover([]));
  }, []);

  return <PostsFeed posts={postsDiscover} title={"discover"} />;
}

function UserPostsFeed() {
  const [posts, setPosts] = useState<PostThumbnail>([]);

  useEffect(() => {
    api
      .get(`${API_URL}/posts`, {
        params: {
          page: 1,
          limit: 2,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setPosts(
          res.data.posts.map((p) => {
            console.log(p);
            return {
              postId: p._id,
              imageUrl: p.images[0],
              author: p.user.username,
              avatar: p.user.avatar,
              title: p.title,
              summary: p.content,
              likes: p.likes?.length ?? 0,
            };
          }),
        );
      }).catch(() => setPosts([]));
  }, []);

  return <PostsFeed posts={posts} />;
}

function PostsFeed(props: { posts: PostThumbnail[]; title?: string }) {
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
            >
              {p.postId}
            </Post>
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
    <div className="flex gap-4 pt-3">
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
