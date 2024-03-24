import React from "react";
import { useMediaQuery } from "../utils/useMediaQuery";
import { useAppSelector } from "../redux/Store";

function CreatePost() {
  const isMobile = useMediaQuery("(min-width: 424px)");
  const userData = useAppSelector((state) => state.auth.user);
  const prefix_img_url = process.env.REACT_APP_PREFIX_URL_IMG;
  const profilePicture = useAppSelector((state) => state.auth.mockIMG);

  return (
    <div
      className="rounded-3 border bg-white shadow-sm py-2 px-3 w-100"
      style={{ maxWidth: "680px" }}
    >
      <div className="d-flex align-items-center gap-2">
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
          className="form-control rounded-pill create-hover-color"
          type="text"
          placeholder="What's on your mind ?"
          data-bs-toggle="modal"
          data-bs-target="#createPostModal"
          readOnly
        />
      </div>
      <hr />
      <div className="d-flex justify-content-around">
        <div className="d-flex align-items-center gap-2 create-hover-color rounded p-1 w-100 justify-content-center">
          <i className="bi bi-camera-video fs-4" style={{ color: "red" }}></i>
          {isMobile && <div>Live video</div>}
        </div>
        <div
          className="d-flex align-items-center gap-2 create-hover-color rounded p-1 w-100 justify-content-center"
          data-bs-toggle="modal"
          data-bs-target="#createPostModal"
        >
          <i className="bi bi-images fs-4" style={{ color: "green" }}></i>
          {isMobile && <div>Photo/Video</div>}
        </div>
        <div className="d-flex align-items-center gap-2 create-hover-color rounded p-1 w-100 justify-content-center">
          <i className="bi bi-emoji-smile fs-4" style={{ color: "orange" }}></i>
          {isMobile && <div>Feeling/Activity</div>}
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
