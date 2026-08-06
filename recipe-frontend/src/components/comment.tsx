import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { type User, NullUser, api, loggedIn, redirect } from "./auth-store";
import { API_URL, getURLParams } from "./utils";
import { Field, FieldLabel } from "./ui/field"
import { useState, useEffect, useCallback, useRef } from "react"
import { AvatarCard } from "./avatar-card"

// todo
// commenting shows comment after posting

type Comment = {
	_id: string
	content: string
	createdAt: string
	replyTo: string
	numReplies?: number 
	numLikes: number
	liked?: boolean
	user: {
		_id: string
		username: string
		avatar: string
	}
}

function timeAgo(isoString) {
  const now = new Date();
  const past = new Date(isoString);
  const diffMs = now - past;
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return `${seconds}s`;
  } else if (minutes < 60) {
    return `${minutes}m`;
  } else if (hours < 24) {
    return `${hours}h`;
  } else if (days < 7) {
    return `${days}d`;
  } else if (weeks < 4) {
    return `${weeks}w`;
  } else if (months < 12) {
    return `${months}mo`;
  } else {
    return `${years}y`;
  }
}

export function useAutoResizeTextarea() {

	const textareaRef = useRef(null);

  	const updateSize = (expand?: boolean) => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = "auto";
		if (expand) el.style.height = `${el.scrollHeight}px`;
	}

	return { textareaRef, updateSize };
}

function Comment(props: {data: Comment, indent: Number, postFunc: any}) {
	const {
		_id: commentId, 
		content, 
		createdAt, 
		user,
		numReplies,
		numLikes: initialNumLikes,
		liked: likedComment
	} = props.data
	const indent = props.indent || 0
	const postFunc = props.postFunc
	const {_id, username, avatar} = user

	const [replying, setReplying] = useState(false)
	const [showReplies, setShowReplies] = useState(false)
	const [replies, setReplies] = useState<Comment[]>([])

	const [liked, setLiked] = useState(likedComment)
	const [numLikes, setNumLikes] = useState(initialNumLikes)

	return <div className={`flex flex-col pb-4`}>
		<AvatarCard user={{username: username, id: _id}}/>
		<div className="pl-3 times-font">
			{content}	
			<div className="flex items-center mt-1">
				<p className="times-font mr-2">{timeAgo(createdAt)}</p>
				<button 
					type="button"
					className="cursor-pointer flex"
					onClick={() => {
						api.patch(`${API_URL}/comment/${commentId}/${liked?'un':''}like`, 
							{}, 
							{
								headers: {
									"Content-Type": "application/json",
									Authorization: "Bearer " + localStorage.getItem("token"),
								},
							}
						).then((res) => {
							setNumLikes(numLikes + (liked?-1:1))
							setLiked(!liked)
						})
					}}
				>
					<img src={`/${liked?'':'unripe-'}strawberry-heart.svg`} 
						title="Like"
						alt="like button" 
						className="m-1" 
						width="20px"/>
				</button>

				<p>{numLikes}</p>

				<button 
					type="button"
					className="w-fit cursor-pointer flex ml-3"
					onClick={() => setReplying(!replying)}
					title="Reply"
				>
					<img src="/banana.svg" alt="reply" width="30px"/>
				</button>

				{(numReplies > 0 || replies.length > 0) && 
				<Button 
					variant="link"
					className="-ml-1"
					onClick={() => {
						api.get(`${API_URL}/comment/${commentId}/replies`, {
							headers: {
								"Content-Type": "application/json",
								Authorization: "Bearer " + localStorage.getItem("token"),
							},
						}).then((res) => {
							setReplies(res.data)
						})
						setShowReplies(!showReplies)
					}}>
						{showReplies?'Hide':'Show'} ({Math.max(numReplies, replies.length)}) replies
				</Button>}
			</div>
		</div>
		<div className="ml-4">
			{showReplies && replies.map((c, i) => {
				const isLast = i === replies.length - 1;
				return (
					<div key={c._id} className="relative pl-6">
						{!isLast && (
							<div className="absolute left-0 top-0 bottom-0 border-l-2 border-gray-400" />
						)}
						<div className="absolute left-0 top-0 h-5 w-5 border-l-2 border-b-2 border-gray-400 rounded-bl-lg" />
						<Comment data={c} indent={indent + 1} />
					</div>
				);
			})}
		</div>
		{replying && <CreateCommentInput
			postFunc={(newComment) => {
				setReplies([newComment, ...replies])	
				setShowReplies(true)
				setReplying(false)
			}}
			parentId={commentId} 
			cancelFunc={()=>setReplying(false)}
			placeholder={`reply to @${username}`}
		/>}
	</div>
}

function CreateCommentInput(props: {
	parentId?: string,
	cancelFunc?: any,
	postFunc: (Comment) => void,
	placeholder?: string
}) {
	const {parentId, cancelFunc, placeholder, postFunc} = props
	const [newCommentText, setNewCommentText] = useState('')

	const { textareaRef, updateSize } = useAutoResizeTextarea();

  	const handleInput = (e) => {
		setNewCommentText(e.target.value);
		updateSize(true);
  	};

	return <div className="flex flex-col items-end">
		<textarea
			ref={textareaRef}
			rows={1}
			value={newCommentText}
			onChange={handleInput}
			placeholder={placeholder || "comment something..."}
			style={{
				width: "100%",
				resize: "none",
				overflow: "hidden",
				boxSizing: "border-box",
				padding: "8px",
				fontSize: "16px",
			}}
		/>

		<div className="flex">
			<Button
				variant="ghost"
				onClick={() => {
					setNewCommentText('')
					updateSize()
					if (cancelFunc) cancelFunc()
				}}
			>
				Cancel
			</Button>
			<Button 
				className="w-fit bg-red-orange hover:bg-red-orange/90"
				onClick={(e) => {
					api.post(`${API_URL}/comment`, {
						content: newCommentText,
						postId: getURLParams().id,
						reply: parentId ? parentId : null,
					}, {
						headers: {
							"Content-Type": "application/json",
							Authorization: "Bearer " + localStorage.getItem("token"),
					  	},
					}).then((res) => {
						if (res.status === 201) {
							if (postFunc) postFunc(res.data.comment);
						}
					})
					e.preventDefault()
				}
			}>
				Comment
			</Button>
		</div>
	</div>
}

export function CommentSection(props: {
	comments?: any,
	setPostData: any,
}) {
	const { comments, setPostData } = props;

	return <div>
		<CreateCommentInput 
			postFunc={(newComment) => {
				setPostData(prev => ({
					...prev,
					comments: [newComment, ...prev.comments]
				}))
			}}
		/>
		<div className={``}>
			{comments.map((c, i) => {
				return <Comment key={c._id} data={c}/>
			})}
		</div>
	</div>
}
