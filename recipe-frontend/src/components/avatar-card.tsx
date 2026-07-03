import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

import { type User, NullUser } from "./auth-store";

import { Skeleton } from "../components/ui/skeleton";

export function ProfilePic(props: { user?: User; onClickFunc?: () => void }) {
  const [localUser, setLocalUser] = useState<User | undefined>(props.user);

  useEffect(() => {
    if (!props.user) {
      const username = localStorage.getItem("username") || "";
      const avatar = localStorage.getItem("avatar") || "";
      const name = localStorage.getItem("name") || "";
      const id = localStorage.getItem("userid") || "";
      setLocalUser({ username, avatar, name, id } as User);
    }
  }, [props.user]);

  const user = props.user ?? localUser;
  const avatarimg = user?.avatar;
  const initials = user?.username?.slice(0, 2).toUpperCase() || "?";
  return (
    <button onClick={props.onClickFunc}>
      <Avatar className="m-2 cursor-pointer">
        <AvatarImage src={avatarimg} className="object-cover" />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    </button>
  );
}

export function AvatarCard(props: {
  className?: string;
  user?: User;
  onClickFunc?: () => void;
  showName?: boolean;
}) {
  let { className, user, showName = true } = props;
  user = user || NullUser;
  const [from, setFrom] = useState<String>("");

  return (
    <div className={"flex items-center justify-start gap-1 " + className}>
      <ProfilePic user={user} onClickFunc={props.onClickFunc} />
      <a href={`/profile?user=${user.username}`}>
        <div className="text-left flex flex-col gap-0.5">
          {user.username ? (
            <p className="font-medium leading-tight">{user.username}</p>
          ) : (
            <Skeleton className="h-8 w-[200px] rounded-full" />
          )}
          {showName && user.name && (
            <p className="text-sm text-muted-foreground leading-tight">
              {user.name}
            </p>
          )}
        </div>
      </a>
    </div>
  );
}
