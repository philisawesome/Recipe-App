import { getImgSrc } from "./utils";
import { Skeleton } from "../components/ui/skeleton";
import { api } from "./auth-store";

export type PostThumbnail = {
  postId: string;
  imageUrl: string;
  author: string;
  avatar: string;
  title: string;
  summary: string;
  likes: number;
  //comments: []
};

export const EmptyPostThumb: PostThumbnail = {
  postId: "",
  imageUrl: "",
  avatar: "",
  author: "",
  title: "",
  summary: "",
  likes: 0,
};

export default function PostThumbnail(props: PostThumbnail) {
  const { postId, imageUrl, author, title, summary, likes, avatar } = props;
  const postSizeClass = "w-[100vw] h-[100vw] md:w-[500px] md:h-[500px]";
  api.get;
  if (!postId || !imageUrl) {
    return <Skeleton className={`${postSizeClass} rounded-lg`} />;
  }

  return (
    <a href={`/post?id=${postId}`} className="block">
      <div className="border-4 rounded-sm p-5">
        {author && avatar ? (
          <div className="flex mb-2">
            <img className="w-8 h-8 rounded-full object-cover" src={avatar} />
            <p className="mx-2 py-1 font-extrabold">{author}</p>
          </div>
        ) : null}

        <div className="my-4">
          <img
            className={`object-cover rounded-sm ${postSizeClass}`}
            src={getImgSrc(imageUrl)}
          />
        </div>
        <h3 className="font-extrabold mt-2">{title}</h3>
        <p className="font-light">{summary}</p>
        <div>
          <p>likes {likes}</p>
        </div>
      </div>
    </a>
  );
}
