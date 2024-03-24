import React from "react";
import { CommentType } from "../../type";
import { useAppSelector } from "../../redux/Store";

interface CommentProps {
  comment: CommentType;
}

function CommentComponent({ comment }: CommentProps) {
  const profilePicture = useAppSelector((state) => state.auth.mockIMG);
  const prefix_img_url = process.env.REACT_APP_PREFIX_URL_IMG;

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
      <div className="rounded-3 p-1 comment-bg">
        <div className="text-capitalize" style={{ fontWeight: "450" }}>
          {comment.firstName} {comment.lastName}
        </div>
        <div className="" style={{ marginTop: "-5px" }}>
          {comment.description}
        </div>
      </div>
    </div>
  );
}

export default CommentComponent;
