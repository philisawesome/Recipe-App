import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { type User, NullUser, api, loggedIn, redirect } from "./auth-store";
import { API_URL, getURLParams } from "./utils";
import { Field, FieldLabel } from "./ui/field"
import { useState, useEffect } from "react"
import { AvatarCard } from "./avatar-card"

type Comment = {
	_id: string
	content: string
	createdAt: string
	user: {
		_id: string
		username: string
		avatar: string
	}
}

function Comment(props: {data: Comment}) {
	const {commentId, content, createdAt, user} = props.data
	const {_id, username, avatar} = user

	const [replying, setReplying] = useState(false)
	console.log(props.data)

	return <div className="flex flex-col">
		<AvatarCard user={{username: username, id: _id}}/>
		{content}	
		<Button className="w-fit" onClick={() => setReplying(!replying)}>
			Reply
		</Button>
		{replying && <CreateCommentInput parentId={commentId}/>}
	</div>
}

function CreateCommentInput(props: {parentId?: string}) {
	const {parentId} = props
	const [newCommentText, setNewCommentText] = useState('')

	return <div>
		<Input 
			value={newCommentText}
			onChange={(e) => {setNewCommentText(e.target.value)}}
			id="content"
		/>
		<Button 
			onClick={(e) => {
				api.post(`${API_URL}/comment`, {
					content: newCommentText,
					postId: getURLParams().id,
					replyTo: parentId ? parentId : null,
				}, {
				  headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + localStorage.getItem("token"),
				  },
				})
				e.preventDefault()
			}
		}>
			Comment
		</Button>
	</div>
}

export function CommentSection(props: {comments}) {
	const {comments} = props

	return <div>
		<CreateCommentInput/>
		{comments.map((c, i) => {
			return <Comment key={c._id} data={c}/>
		})}
	</div>
}
