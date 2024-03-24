import React, { useEffect, useState } from "react";
import { PostType } from "../../type";
import { useAppSelector } from "../../redux/Store";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import CommentComponent from "./CommentComponent";

interface PostProps {
  props: PostType;
  comment: string;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  commentPost: (postId: string, comment: string) => void;
  setComment: (comment: string) => void;
}

function Post({
  props,
  comment,
  deletePost,
  likePost,
  commentPost,
  setComment,
}: PostProps) {
  const profilePicture = useAppSelector((state) => state.auth.mockIMG);
  const prefix_img_url = process.env.REACT_APP_PREFIX_URL_IMG;
  const [createDate, setCreateDate] = useState("");
  const [commentInPost, setCommentInPost] = useState<string>("");
  const [isLike, setIsLike] = useState(false);
  const userData = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.createdAt) {
      const formattedDate = format(
        new Date(props.createdAt),
        "dd MMM yyyy hh:mm a"
      );
      setCreateDate(formattedDate);
    }
  }, [props]);

  useEffect(() => {
    if (userData && userData._id && props.likes) {
      const like = props.likes.includes(userData._id);
      setIsLike(like);
    }
    // eslint-disable-next-line
  }, [props]);

  const userNavigator = (id: string) => {
    navigate(`/profile/${id}`);
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
            props.userPicturePath
              ? prefix_img_url + props?.userPicturePath
              : profilePicture
          }
          style={{ width: "36px", height: "36px", objectFit: "cover" }}
          onClick={() => {
            if (props.userId) {
              userNavigator(props.userId);
            }
          }}
        />
        <div className="d-flex justify-content-between w-100">
          <div>
            <div
              className="fw-bold text-capitalize hover-cursor"
              onClick={() => {
                if (props.userId) {
                  userNavigator(props.userId);
                }
              }}
            >
              {props.firstName} {props.lastName}
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
                if (props._id) {
                  deletePost(props._id);
                }
              }}
              className="bi bi-x-lg create-hover-color rounded-circle p-2"
              style={{ height: "fit-content" }}
            ></i>
          </div>
        </div>
      </div>
      <div>{props.description}</div>
      {props.picturePath && (
        <img
          alt="post"
          className="w-100 h-100 rounded mt-1"
          src={prefix_img_url + props?.picturePath}
          style={{ width: "36px", height: "36px", objectFit: "cover" }}
        />
      )}
      <div className="d-flex justify-content-between w-100 my-2">
        <div>
          {props.likes && props.likes?.length > 0 && (
            <>
              <i className="bi bi-heart-fill text-danger me-1"></i>
              {props.likes.length} Likes
            </>
          )}
        </div>
        <div>
          {props.comments && props.comments?.length > 0 && (
            <>{props.comments.length} Comments</>
          )}
        </div>
      </div>
      <div className="d-flex justify-content-around text-secondary border-top border-bottom">
        <div
          className="d-flex my-1 align-items-center gap-1 create-hover-color rounded p-1 w-100 justify-content-center"
          onClick={() => {
            if (props._id) {
              likePost(props._id);
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
            if (props._id) {
              commentPost(props._id, commentInPost);
              setCommentInPost("");
            }
          }}
        ></i>
      </div>
      {props.comments &&
        props.comments.length > 0 &&
        props.comments.map((comment, index) => (
          <CommentComponent key={index} comment={comment} />
        ))}
    </div>
  );
}

export default Post;
