import React, { useEffect, useState } from "react";
import FileDropzone from "../DropZone";
import { AppDispatch, useAppSelector } from "../../redux/Store";
import { CreatePostProps } from "../../type";
import { useDispatch } from "react-redux";
import { createPost } from "../../redux/postSlice";

function CreatePostModal() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileURL, setUploadedFileURL] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const userData = useAppSelector((state) => state.auth.user);
  const prefix_img_url = process.env.REACT_APP_PREFIX_URL_IMG;
  const profilePicture = useAppSelector((state) => state.auth.mockIMG);
  const dispatch = useDispatch<AppDispatch>();

  const handleFileAdded = (files: File[]) => {
    setUploadedFile(files[0]);
  };

  useEffect(() => {
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedFileURL(e.target?.result as string);
      };
      reader.readAsDataURL(uploadedFile);
    }
  }, [uploadedFile]);

  const handlePost = async () => {
    if (userData && userData._id) {
      const creatPostProps: CreatePostProps = {
        userId: userData._id,
        description,
        uploadedFile,
      };
      dispatch(createPost(creatPostProps));
      setUploadedFileURL("");
      setDescription("");
    }
  };

  return (
    <div>
      <div
        className="modal fade"
        id="createPostModal"
        tabIndex={-1}
        aria-labelledby="createPostModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createPostModalLabel">
                Create Post
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="d-flex align-items-center gap-2 my-2">
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
                <div className="">
                  <div className="text-capitalize">
                    {userData?.firstName} {userData?.lastName}
                  </div>
                  <div className="comment-bg px-1 rounded">
                    <i className="bi bi-people-fill"></i> Friends
                  </div>
                </div>
              </div>
              <textarea
                className="w-100 mt-2"
                placeholder={`What's on your mind`}
                style={{ border: "none", outline: "none" }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {uploadedFile ? (
                <div className="position-relative">
                  <i
                    className="bi bi-x-lg hover-cursor position-absolute rounded-circle p-2"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.5)",
                      top: 25,
                      right: 10,
                    }}
                    onClick={() => {
                      setUploadedFile(null);
                      setUploadedFileURL("");
                    }}
                  ></i>
                  <img
                    src={uploadedFileURL}
                    alt="upload"
                    className="w-100 mt-3 rounded"
                  />
                </div>
              ) : (
                <div className="upload">
                  <FileDropzone onFileAdded={handleFileAdded} />
                </div>
              )}
            </div>
            <div
              className="modal-footer justify-content-center "
              style={{ borderTop: "unset" }}
            >
              <button
                type="button"
                className="btn btn-primary w-100"
                data-bs-dismiss="modal"
                onClick={() => handlePost()}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePostModal;
