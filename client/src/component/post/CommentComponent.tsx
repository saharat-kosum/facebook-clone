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
  deleteComment: (post: PostType, commentIndex: number) => Promise<void>;
}

function CommentComponent({
  comment,
  editComment,
  index,
  post,
  deleteComment,
}: CommentProps) {
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
          <div data-bs-toggle="dropdown">
            <i className="bi bi-three-dots hover-cursor">
              <ul
                className="dropdown-menu end-0"
                style={{ left: "unset", width: "fit-content" }}
              >
                <li
                  onClick={() => {
                    setIsEditComment(true);
                  }}
                >
                  <div className="dropdown-item hover-cursor">Edit</div>
                </li>
                <li
                  onClick={() => {
                    deleteComment(post, index);
                  }}
                >
                  <div className="dropdown-item hover-cursor">Delete</div>
                </li>
              </ul>
            </i>
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
