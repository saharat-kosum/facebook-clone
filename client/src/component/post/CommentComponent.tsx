import React, { useState } from "react";
import { CommentType, PostType } from "../../type";
import { useAppSelector } from "../../redux/Store";

interface CommentProps {
  comment: CommentType;
  editComment: (
    post: PostType,
    commentIndex: number,
    newDescription: string
  ) => Promise<void>;
  index: number;
  post: PostType;
}

function CommentComponent({ comment, editComment, index, post }: CommentProps) {
  const profilePicture = useAppSelector((state) => state.auth.mockIMG);
  const prefix_img_url = process.env.REACT_APP_PREFIX_URL_IMG;
  const [isEditComment, setIsEditComment] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    comment.description
  );

  return (
    <div className="d-flex align-items-center gap-2 my-2">
      <img
        alt="profile"
        className="rounded-circle border"
        src={
          comment.userPicturePath
            ? prefix_img_url + comment.userPicturePath
            : profilePicture
        }
        style={{ width: "36px", height: "36px", objectFit: "cover" }}
      />
      <div
        className={`rounded-3 p-1 comment-bg ${isEditComment ? "w-100" : ""}`}
      >
        <div className="d-flex gap-3">
          <div className="text-capitalize" style={{ fontWeight: "450" }}>
            {comment.firstName} {comment.lastName}
          </div>
          <div onClick={() => setIsEditComment(true)}>
            <i className="bi bi-three-dots hover-cursor"></i>
          </div>
        </div>
        {isEditComment ? (
          <div className="d-flex gap-1">
            <input
              className="form-control rounded-pill"
              type="text"
              placeholder="Write a comment..."
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
            <i
              className="bi bi-send-fill create-hover-color rounded-circle p-2"
              onClick={() => {
                editComment(post, index, editedDescription);
                setIsEditComment(false);
              }}
            ></i>
          </div>
        ) : (
          <div className="" style={{ marginTop: "-5px" }}>
            {comment.description}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentComponent;
