import React, { useEffect, useState } from "react";
import { CommentType, PostType } from "../../type";
import { AppDispatch, useAppSelector } from "../../redux/Store";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import CommentComponent from "./CommentComponent";
import {
  commentPostThunk,
  deletePostThunk,
  likePostThunk,
} from "../../redux/postSlice";
import { useDispatch } from "react-redux";

interface PostProps {
  post: PostType;
}

function Post({ post }: PostProps) {
  const profilePicture = useAppSelector((state) => state.auth.mockIMG);
  const prefix_img_url = process.env.REACT_APP_PREFIX_URL_IMG;
  const [createDate, setCreateDate] = useState("");
  const [commentInPost, setCommentInPost] = useState<string>("");
  const [isLike, setIsLike] = useState(false);
  const userData = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (post.createdAt) {
      const formattedDate = format(
        new Date(post.createdAt),
        "dd MMM yyyy hh:mm a"
      );
      setCreateDate(formattedDate);
    }
  }, [post]);

  useEffect(() => {
    if (userData && userData._id && post.likes) {
      const like = post.likes.includes(userData._id);
      setIsLike(like);
    }
  }, [post, userData]);

  const userNavigator = (id: string) => {
    navigate(`/profile/${id}`);
  };

  const commentPost = async (id: string, commentProp: string) => {
    if (userData) {
      const newComment: CommentType = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        userPicturePath: userData.picturePath,
        description: commentProp,
      };
      const commentPayload = { id, newComment };
      dispatch(commentPostThunk(commentPayload));
    }
  };

  const deletePost = async (id: string) => {
    const result = window.confirm("Are you sure you want to delete this post?");
    if (result) {
      dispatch(deletePostThunk(id));
    }
  };

  return (
    <div
      className="rounded-3 border bg-white shadow-sm py-2 px-2 px-md-3 mt-3"
      style={{ maxWidth: "680px" }}
    >
      <div className="d-flex align-items-center gap-2 mb-2">
        <img
          alt="profile"
          className="rounded-circle border hover-cursor"
          src={
            post.userPicturePath
              ? prefix_img_url + post?.userPicturePath
              : profilePicture
          }
          style={{ width: "36px", height: "36px", objectFit: "cover" }}
          onClick={() => {
            if (post.userId) {
              userNavigator(post.userId);
            }
          }}
        />
        <div className="d-flex justify-content-between w-100">
          <div>
            <div
              className="fw-bold text-capitalize hover-cursor"
              onClick={() => {
                if (post.userId) {
                  userNavigator(post.userId);
                }
              }}
            >
              {post.firstName} {post.lastName}
            </div>
            <div
              className="text-black-50"
              style={{ marginTop: "-5px", fontSize: "small" }}
            >
              {createDate}
            </div>
          </div>
          <div className="d-flex">
            <i
              className="bi bi-three-dots ms-1 create-hover-color rounded-circle p-2"
              style={{ height: "fit-content" }}
            ></i>
            <i
              onClick={() => {
                if (post._id) {
                  deletePost(post._id);
                }
              }}
              className="bi bi-x-lg create-hover-color rounded-circle p-2"
              style={{ height: "fit-content" }}
            ></i>
          </div>
        </div>
      </div>
      <div>{post.description}</div>
      {post.picturePath && (
        <img
          alt="post"
          className="w-100 h-100 rounded mt-1"
          src={prefix_img_url + post?.picturePath}
          style={{ width: "36px", height: "36px", objectFit: "cover" }}
        />
      )}
      <div className="d-flex justify-content-between w-100 my-2">
        <div>
          {post.likes && post.likes?.length > 0 && (
            <>
              <i className="bi bi-heart-fill text-danger me-1"></i>
              {post.likes.length} Likes
            </>
          )}
        </div>
        <div>
          {post.comments && post.comments?.length > 0 && (
            <>{post.comments.length} Comments</>
          )}
        </div>
      </div>
      <div className="d-flex justify-content-around text-secondary border-top border-bottom">
        <div
          className="d-flex my-1 align-items-center gap-1 create-hover-color rounded p-1 w-100 justify-content-center"
          onClick={() => {
            if (post._id && userData && userData._id) {
              const likePostProp = { id: post._id, userId: userData._id };
              dispatch(likePostThunk(likePostProp));
            }
          }}
        >
          <i
            className={`bi bi-heart-fill fs-5 ${isLike ? "text-danger" : ""}`}
          ></i>
          <div>Like</div>
        </div>
        <div className="d-flex my-1 align-items-center gap-1 create-hover-color rounded p-1 w-100 justify-content-center">
          <i className="bi bi-chat-left fs-5"></i>
          <div>Comment</div>
        </div>
        <div className="d-flex my-1 align-items-center gap-1 create-hover-color rounded p-1 w-100 justify-content-center">
          <i className="bi bi-box-arrow-up-right fs-5"></i>
          <div>Share</div>
        </div>
      </div>
      <div className="d-flex align-items-center gap-2 mt-2">
        <img
          alt="profile"
          className="rounded-circle border"
          src={
            userData?.picturePath
              ? prefix_img_url + userData?.picturePath
              : profilePicture
          }
          style={{ width: "36px", height: "36px", objectFit: "cover" }}
        />
        <input
          className="form-control rounded-pill"
          type="text"
          placeholder="Write a comment..."
          value={commentInPost}
          onChange={(e) => setCommentInPost(e.target.value)}
        />
        <i
          className="bi bi-send-fill create-hover-color rounded-circle p-2"
          onClick={() => {
            if (post._id) {
              commentPost(post._id, commentInPost);
              setCommentInPost("");
            }
          }}
        ></i>
      </div>
      {post.comments &&
        post.comments.length > 0 &&
        post.comments.map((comment, index) => (
          <CommentComponent key={index} comment={comment} />
        ))}
    </div>
  );
}

export default Post;
