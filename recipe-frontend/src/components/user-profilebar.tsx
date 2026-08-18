import { AvatarCard } from "./avatar-card";
import { Toggle } from "./ui/toggle";
import Box from "@mui/material/Box";
import Scroll from "./ui/infinite-scroll";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useStore } from "@nanostores/react";
import {
  type User,
  NullUser,
  loggedIn,
  my_username,
  api,
  redirect,
} from "./auth-store";
import { API_URL, getURLParams } from "./utils";
import type PostThumbnail from "./post-thumbnail.tsx";
import Post from "./post-thumbnail.tsx";
type FollowerPreview = {
  username: string;
  avatar: string;
  followed: boolean;
  _id: string;
};

function FollowersPopup(props: { userId: string }) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const $loggedIn = useStore(loggedIn);
  const $my_username = useStore(my_username);

  const [followerArr, setFollowerArr] = useState<FollowerPreview[]>([]);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState(false);
  const [skip, setSkip] = useState(0);

  const [refreshKey, setRefreshKey] = useState(0);

  function RenderItem(follower: FollowerPreview) {
    return (
      <div className="flex items-center justify-between mb-2">
        <a
          className="flex items-center gap-2"
          href={`/profile?user=${follower.username}`}
        >
          <img
            loading="lazy"
            className="flex w-9 h-9 object-cover shrink-0 overflow-hidden rounded-full"
			alt="profile pic"
            src={follower.avatar}
          ></img>
          <h3>{follower.username}</h3>
        </a>
        {$loggedIn && $my_username === follower.username ? null : (
          <Button
            className="cursor-pointer z-4"
            variant="outline"
            onClick={() => {
              if (!follower.followed) {
                api
                  .post(
                    `${API_URL}/profile/${follower._id}/follow`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                    },
                  )
                  .then((res) => {
                    if (res.status === 200) {
                      //setRefreshKey((k) => k + 1);
                      const newArray = followerArr.map((item) => {
                        if (item._id === follower._id) {
                          item.followed = true;
                        }
                        return item;
                      });
                      setFollowerArr([...newArray]);
                    }
                  })

                  .catch((e) => {
                    console.log(e);
                  });
              } else {
                api
                  .delete(`${API_URL}/profile/${follower._id}/unfollow`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  })
                  .then((res) => {
                    if (res.status === 200) {
                      //setRefreshKey((k) => k + 1);
                      const newArray = followerArr.map((item) => {
                        if (item._id === follower._id) {
                          item.followed = false;
                        }
                        return item;
                      });
                      setFollowerArr([...newArray]);
                    }
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }
            }}
          >
            {follower.followed ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>
    );
  }
  useEffect(() => {
    if (!props.userId) return;
    api
      .get(`${API_URL}/profile/${props.userId}/followers`, {
        params: {
          skip,
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setHasMore(res.data.hasMore);
        setFollowerArr((prev) => [...prev, ...res.data.users]);
        setFollowerCount(res.data.total);
      });
  }, [props.userId /*refreshKey*/, , skip]);

  function fetchMore() {
    if (hasMore) {
      setSkip(skip + 10);
    } else {
      return;
    }
  }
  return (
    <div className="">
      <Button className="cursor-pointer" onClick={handleClickOpen}>
        {followerCount}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
        slotProps={{
          paper: {
            sx: {
			  width: "100%",
              minHeight: "600px",
              borderRadius: "24px",
              maxWidth: "900px",
              maxHeight: "600px",
            },
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.5rem", textAlign: "center" }}>
          Followers
        </DialogTitle>
        <div className="border-gray-385 border-t -my-2"> </div>

        <DialogContent>
          <Scroll
            data={followerArr}
            fetchMore={fetchMore}
            hasMore={hasMore}
            renderItem={RenderItem}
          ></Scroll>
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

function FollowingPopup(props: { userId: string }) {
  const $loggedIn = useStore(loggedIn);
  const $my_username = useStore(my_username);

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [followingArr, setFollowingArr] = useState<FollowerPreview[]>([]);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  function RenderItem(follower: FollowerPreview) {
    return (
      <div className="flex items-center justify-between mb-2">
        <a
          className="flex items-center gap-2"
          href={`/profile?user=${follower.username}`}
        >
          <img
            loading="lazy"
            className="flex w-9 h-9 object-cover shrink-0 overflow-hidden rounded-full"
			alt="profile pic"
            src={follower.avatar}
          ></img>
          <h3>{follower.username}</h3>
        </a>
        {$loggedIn && $my_username === follower.username ? null : (
          <Button
            className="cursor-pointer z-4"
            variant="outline"
            onClick={() => {
              if (!follower.followed) {
                api
                  .post(
                    `${API_URL}/profile/${follower._id}/follow`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                    },
                  )
                  .then((res) => {
                    if (res.status === 200) {
                      //setRefreshKey((k) => k + 1);
                      const newArray = followingArr.map((item) => {
                        if (item._id === follower._id) {
                          item.followed = true;
                        }
                        return item;
                      });
                      setFollowingArr([...newArray]);
                    }
                  })

                  .catch((e) => {
                    console.log(e);
                  });
              } else {
                api
                  .delete(`${API_URL}/profile/${follower._id}/unfollow`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  })
                  .then((res) => {
                    if (res.status === 200) {
                      //setRefreshKey((k) => k + 1);
                      const newArray = followingArr.map((item) => {
                        if (item._id === follower._id) {
                          item.followed = false;
                        }
                        return item;
                      });
                      setFollowingArr([...newArray]);
                    }
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }
            }}
          >
            {follower.followed ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>
    );
  }
  useEffect(() => {
    if (!props.userId) return;
    api
      .get(`${API_URL}/profile/${props.userId}/following`, {
        params: {
          skip,
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setHasMore(res.data.hasMore);

        setFollowingArr((prev) => [...prev, ...res.data.users]);
        setFollowingCount(res.data.total);
      });
  }, [props.userId, refreshKey, skip]);

  function fetchMore() {
    if (hasMore) {
      setSkip(skip + 10);
    } else {
      return;
    }
  }
  return (
    <div>
      <Button className="cursor-pointer" onClick={handleClickOpen}>
        {followingCount}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
        slotProps={{
          paper: {
            sx: {
			  width: "100%",
              minHeight: "600px",
              borderRadius: "24px",
              maxWidth: "900px",
              maxHeight: "600px",
            },
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.5rem", textAlign: "center" }}>
          Following
        </DialogTitle>
        <div className="border-gray-385 border-t -my-2"> </div>

        <DialogContent>
          <Scroll
            data={followingArr}
            fetchMore={fetchMore}
            hasMore={hasMore}
            renderItem={RenderItem}
          ></Scroll>
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
export default function UserProfileBar(props: {}) {
  const [followed, setFollowed] = useState(false);
  const [user, setUser] = useState<User>(NullUser);

  const $loggedIn = useStore(loggedIn);
  const $my_username = useStore(my_username);

  useEffect(() => {
    let params = getURLParams();
    api
      .get(`${API_URL}/username/${params.user}`, {
        params: { follower_username: $my_username },
      })
      .then((res) => {
        setUser({
          username: res.data.user.username,
          name: res.data.user.name,
          id: res.data.user._id,
          avatar: res.data.user.avatar,
        });
        setFollowed(res.data.following);
      })
      .catch((e) => {
        console.log(e.response.data.error);
      });
  }, []);

  return (
    <div className="flex items-center gap-2">
      <AvatarCard
        user={user}
        onClickFunc={() => {
          if (user.username == $my_username) {
            redirect.set("/profilepic?from=profile");
          } else {
            redirect.set(`/profile?user=${user.username}`);
          }
        }}
      />
      {($loggedIn && $my_username === user.username && (
        <Button
          variant="outline"
          onClick={() => {
            async function goHome() {
              //await navigate("/")
            }
            //goHome().then(()=>{auth.logout()})
          }}
        >
          Logout
        </Button>
      )) || (
        <Button
          variant="outline"
          onClick={() => {
            if (!followed) {
              api
                .post(
                  `${API_URL}/profile/${user.id}/follow`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  },
                )
                .then((res) => {
                  if (res.status === 200) {
                    setFollowed(!followed);
                  }
                })
                .catch((e) => {
                  console.log(e);
                });
            } else {
              api
                .delete(`${API_URL}/profile/${user.id}/unfollow`, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                })
                .then((res) => {
                  if (res.status === 200) {
                    setFollowed(!followed);
                  }
                })
                .catch((e) => {
                  console.log(e);
                });
            }
          }}
        >
          {followed ? "Unfollow" : "Follow"}
        </Button>
      )}
      <div className="flex items-center">
        {" "}
        <FollowersPopup userId={user.id}></FollowersPopup>
        <FollowingPopup userId={user.id}></FollowingPopup>
      </div>
    </div>
  );
}

export function UserPosts() {
  const [postIds, setPostIds] = useState<PostThumbnail[]>([]);

  useEffect(() => {
    const params = getURLParams();

    let userid: string;
    api.get(`${API_URL}/username/${params.user}`).then((res) => {
      userid = res.data.user._id;
      api.get(`${API_URL}/userPosts/${userid}`).then((res) => {
        setPostIds(
          res.data.posts.map((m: any) => {
            return {
              postId: m._id,
              imageUrl: m.images[0],
              likes: m.likes.length,
            };
          }),
        );
      });
    });
  }, []);

  return (
    <div className="w-fit grid grid-cols-1 md:grid-cols-2 self-center gap-1">
      {postIds.map((p, id) => {
        return (
          <Post
            key={id}
            postId={p.postId}
            imageUrl={p.imageUrl}
            likes={p.likes}
          ></Post>
        );
      })}
    </div>
  );
}
