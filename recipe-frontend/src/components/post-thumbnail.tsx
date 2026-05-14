import { getImgSrc } from "./utils"
import { Skeleton } from "../components/ui/skeleton"

export type PostThumbnail = {
	postId: string
	imageUrl: string
}

export const EmptyPostThumb: PostThumbnail = {
	postId: "", imageUrl: ""
}

export default function PostThumbnail(props: PostThumbnail) {
	const {postId, imageUrl} = props
	const postSizeClass = "w-[95vw] h-[95vw] md:w-[400px] md:h-[400px]"

	if (!postId || !imageUrl) {
		return <Skeleton className={`${postSizeClass} rounded-lg`} />
	}

	return <a href={`/post?id=${postId}`} className="block">
		<img 
		 	className={`object-cover ${postSizeClass}`}
			src={getImgSrc(imageUrl)}/>
	</a>
}
