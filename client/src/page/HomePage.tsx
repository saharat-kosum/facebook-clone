import React, { useEffect } from "react";
import NavBar from "../component/NavBar";
import SideBar from "../component/sideBar/SideBar";
import Contact from "../component/Contact";
import Post from "../component/post/Post";
import CreatePost from "../component/CreatePost";
import CreatePostModal from "../component/modals/CreatePostModal";
import { useMediaQuery } from "../utils/useMediaQuery";
import { AppDispatch, useAppSelector } from "../redux/Store";
import Loading from "../component/Loading";
import { getUserDetail } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { getFeedPost } from "../redux/postSlice";

function HomePage() {
  const contactHandle = useMediaQuery("(min-width: 1270px)");
  const isLaptop = useMediaQuery("(min-width: 1070px)");
  const userData = useAppSelector((state) => state.auth.user);
  const authLoading = useAppSelector((state) => state.auth.loading);
  const postLoading = useAppSelector((state) => state.post.loading);
  const token = useAppSelector((state) => state.auth.token);
  const posts = useAppSelector((state) => state.post.posts);
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

  if (!token) {
    return <></>;
  }

  return (
    <>
      <NavBar />
      <Loading isShow={authLoading || postLoading} />
      <div className="px-2">
        <CreatePostModal />
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
                posts.map((post) => <Post key={post._id} post={post} />)
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
