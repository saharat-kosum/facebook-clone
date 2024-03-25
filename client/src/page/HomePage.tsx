import React, { useEffect, useState } from "react";
import NavBar from "../component/NavBar";
import SideBar from "../component/sideBar/SideBar";
import Contact from "../component/Contact";
import Post from "../component/post/Post";
import CreatePost from "../component/CreatePost";
import CreatePostModal from "../component/modals/CreatePostModal";
import { useMediaQuery } from "../utils/useMediaQuery";
import { AppDispatch, useAppSelector } from "../redux/Store";
import axios from "axios";
import { CommentType, PostType } from "../type";
import Loading from "../component/Loading";
import { getUserDetail, setLoading, setLogIn } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { getFeedPost } from "../redux/postSlice";

function HomePage() {
  const contactHandle = useMediaQuery("(min-width: 1270px)");
  const isLaptop = useMediaQuery("(min-width: 1070px)");
  const [comment, setComment] = useState<string>("");
  const userData = useAppSelector((state) => state.auth.user);
  const isLoading = useAppSelector((state) => state.auth.loading);
  const token = useAppSelector((state) => state.auth.token);
  const posts = useAppSelector((state) => state.post.post);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (token && token.length > 0) {
      dispatch(getFeedPost());

      if (!userData) {
        dispatch(getUserDetail());
      }
    } else {
      window.location.replace("/");
    }
  }, [token, userData, dispatch]);

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
    setComment("");
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
      <div className="px-2">
        <CreatePostModal setPosts={setPosts} posts={posts} />
        <div className="pb-3" style={{ minHeight: "94vh" }}>
          <div
            className="d-flex justify-content-between"
            style={{ position: "relative" }}
          >
            <div
              className=""
              style={{
                position: "fixed",
                display: isLaptop ? "inherit" : "none",
              }}
            >
              <SideBar />
            </div>
            <div></div>
            <div className="mt-3">
              <CreatePost />
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
            <div></div>
            <div
              className=""
              style={{
                position: "fixed",
                right: 0,
                display: contactHandle ? "inherit" : "none",
              }}
            >
              <Contact />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
