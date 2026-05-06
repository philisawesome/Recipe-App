import axios from "axios"

import {
	loggedIn,
	redirect,
	api,
} from "./auth-store"
import { useStore } from '@nanostores/react'

import Post from "./post-thumbnail.tsx"
import type PostThumbnail from "./post-thumbnail.tsx"

import { API_URL } from "./utils"
import { useState, useEffect } from "react"

function PostsDiscover() {
	const [postsDiscover, setPostsDiscover] = useState<PostThumbnail>([])

	useEffect(() => {
		api.get(`${API_URL}/postDiscover`)
		.then((res) => {
			setPostsDiscover(
				res.data.posts.map((p) => {
				console.log(p.images[0])
					return {postId: p._id, imageUrl: p.images[0]}
				})
			)
		})
	}, [])

	return <PostsFeed posts={postsDiscover} title={"discover"}/>
}

function UserPostsFeed() {
	const [posts, setPosts] = useState<PostThumbnail>([])

	useEffect(() => {
		api.get(`${API_URL}/posts`, {
			params: {
				page: 1,	
				limit: 2,
			},
			headers: { 
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		}).then((res) => {
			setPosts(
				res.data.posts.map((p) => {
					return {postId: p._id, imageUrl: p.images[0]}
				})
			)
		})
	}, [])

	return <PostsFeed posts={posts} title={"your feed"}/>
}


function PostsFeed(props: {posts: PostThumbnail[], title?: string}) {
	const { posts, title } = props
	return <div className="mt-3 w-full">
		{title && <p>{title}</p>}
		<div className="grid grid-cols-1 
			gap-3
			md:grid-cols-2 md:gap-1
			justify-items-center
			2xl:grid-cols-3">
			{posts.map((p, k) => {
				return <Post key={k} 
						postId={p.postId} 
						imageUrl={p.imageUrl}>
						{p.postId}
					</Post>
				})
			}
		</div>
	</div>
}

export function AuthBasedPostsFeed() {
	const $loggedIn = useStore(loggedIn)
	return <>
		{$loggedIn && <UserPostsFeed/>}
		<PostsDiscover/>
	</>
}
