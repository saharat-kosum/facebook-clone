import React, { useEffect } from "react";
import NavBar from "../component/NavBar";
import Post from "../component/post/Post";
import ProfileDetail from "../component/ProfileDetail";
import { useMediaQuery } from "../utils/useMediaQuery";
import { AppDispatch, useAppSelector } from "../redux/Store";
import { useDispatch } from "react-redux";
import Loading from "../component/Loading";
import { useParams } from "react-router-dom";
import { getProfile, getUserDetail } from "../redux/authSlice";
import { getProfilePost } from "../redux/postSlice";

function ProfilePage() {
  const isLaptop = useMediaQuery("(min-width: 1000px)");
  const userData = useAppSelector((state) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const token = useAppSelector((state) => state.auth.token);
  const authLoading = useAppSelector((state) => state.auth.loading);
  const postLoading = useAppSelector((state) => state.post.loading);
  const posts = useAppSelector((state) => state.post.posts);
  const profileDetail = useAppSelector((state) => state.auth.profile);

  useEffect(() => {
    if (token && token.length > 0 && params.userId) {
      dispatch(getProfilePost(params.userId));
      dispatch(getProfile(params.userId));

      if (!userData) {
        dispatch(getUserDetail());
      }
    } else {
      window.location.replace("/");
    }
  }, [token, userData, params.userId, dispatch]);

  if (!token || !profileDetail) {
    return <></>;
  }

  return (
    <>
      <NavBar />
      <Loading isShow={authLoading || postLoading} />
      <div className="container" style={{ minHeight: "94vh" }}>
        <div className={`${isLaptop ? "d-flex" : ""} pb-3 gap-3`}>
          <div
            className={`${isLaptop ? "" : "m-auto"} w-100`}
            style={{ maxWidth: "490px" }}
          >
            <div style={{ height: "75px" }}></div>
            <ProfileDetail props={profileDetail} />
          </div>
          <div className="w-100">
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
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
