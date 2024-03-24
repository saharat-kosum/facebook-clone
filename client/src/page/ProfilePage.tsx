import React, { useEffect, useState } from "react";
import NavBar from "../component/NavBar";
import Post from "../component/post/Post";
import ProfileDetail from "../component/ProfileDetail";
import { useMediaQuery } from "../utils/useMediaQuery";
import axios from "axios";
import { AppDispatch, useAppSelector } from "../redux/Store";
import { CommentType, PostType, UserType } from "../type";
import { useDispatch } from "react-redux";
import { setLoading, setLogIn } from "../redux/authSlice";
import Loading from "../component/Loading";
import { useParams } from "react-router-dom";

function ProfilePage() {
  const isLaptop = useMediaQuery("(min-width: 1000px)");
  const userData = useAppSelector((state) => state.auth.user);
  const [friendData, setFriendData] = useState<UserType | undefined>(undefined);
  const [posts, setPosts] = useState<PostType[] | undefined>(undefined);
  const [comment, setComment] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const token = useAppSelector((state) => state.auth.token);
  const isLoading = useAppSelector((state) => state.auth.loading);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        if (token && token.length > 0) {
          const postsResponse = await axios.get(
            `/posts/${params.userId}/posts`
          );
          setPosts(postsResponse.data);

          const friendResponse = await axios.get(
            `/users/friend/${params.userId}`
          );
          setFriendData(friendResponse.data);

          if (!userData) {
            const { data } = await axios.get(`/users`);
            dispatch(setLogIn(data));
          }
        } else {
          window.location.replace("/");
        }
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [token, userData, params.userId, dispatch]);

  const likePost = async (id: string) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.put(`/posts/${id}/like`, {
        userId: userData?._id,
      });
      const data: PostType = response.data;
      const updatedPosts = posts?.map((post) => {
        if (post._id === data._id) {
          return data;
        }
        return post;
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const commentPost = async (id: string, commentProp: string) => {
    dispatch(setLoading(true));
    if (!userData) {
      return;
    }
    const newComment: CommentType = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      userPicturePath: userData.picturePath,
      description: commentProp,
    };
    try {
      const response = await axios.post(`/posts/add/comment/${id}`, newComment);
      const data: PostType = response.data;
      const updatedPosts = posts?.map((post) => {
        if (post._id === data._id) {
          return data;
        }
        return post;
      });
      setComment("");
      setPosts(updatedPosts);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deletePost = async (id: string) => {
    const result = window.confirm("Are you sure you want to delete this post?");
    if (result) {
      dispatch(setLoading(true));
      try {
        const response = await axios.delete(`/posts/delete/${id}`);
        if (response.status === 200) {
          const filter = posts?.filter((post) => post._id !== id);
          if (filter) {
            setPosts(filter);
          }
        } else if (response.status === 404) {
          alert("Post not found");
        } else {
          alert("Delete post failed");
        }
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  if (!token) {
    return <></>;
  }

  return (
    <>
      <NavBar />
      <Loading isShow={isLoading} />
      <div className="container" style={{ minHeight: "94vh" }}>
        <div className={`${isLaptop ? "d-flex" : ""} pb-3 gap-3`}>
          <div
            className={`${isLaptop ? "" : "m-auto"} w-100`}
            style={{ maxWidth: "490px" }}
          >
            <div style={{ height: "75px" }}></div>
            <ProfileDetail
              dateOfBirth={friendData?.dateOfBirth || ""}
              firstName={friendData?.firstName || ""}
              lastName={friendData?.lastName || ""}
              email={friendData?.email || ""}
              password={""}
              occupation={friendData?.occupation || ""}
              location={friendData?.location || ""}
              picturePath={friendData?.picturePath}
              createdAt={friendData?.createdAt}
            />
          </div>
          <div className="w-100">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <Post
                  key={post._id}
                  props={post}
                  deletePost={deletePost}
                  likePost={likePost}
                  commentPost={commentPost}
                  comment={comment}
                  setComment={setComment}
                />
              ))
            ) : (
              <div
                className="d-flex justify-content-center align-items-center text-secondary"
                style={{ height: "60vh" }}
              >
                <p>No post yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
