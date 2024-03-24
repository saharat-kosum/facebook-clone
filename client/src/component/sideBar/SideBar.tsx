import React from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/Store";

function SideBar() {
  const userData = useAppSelector((state) => state.auth.user);
  const prefix_img_url = process.env.REACT_APP_PREFIX_URL_IMG;
  const navigate = useNavigate();
  const profilePicture = useAppSelector((state) => state.auth.mockIMG);

  const profile = () => {
    navigate(`/profile/${userData?._id}`);
  };

  return (
    <ul className="mt-3 ms-2 " style={{ padding: "unset", width: "175px" }}>
      <li
        className="rounded p-2 sidebar-hover-color w-100 text-start lh-base text-capitalize"
        onClick={() => profile()}
      >
        <img
          alt="profile"
          className="rounded-circle border me-2"
          src={
            userData?.picturePath
              ? prefix_img_url + userData?.picturePath
              : profilePicture
          }
          style={{ width: "36px", height: "36px", objectFit: "cover" }}
        />
        {userData?.firstName} {userData?.lastName}
      </li>
      <li className="rounded p-2 sidebar-hover-color w-100 text-start lh-base">
        <i
          className="pe-2 fs-4 bi bi-people-fill"
          style={{ color: "#1B74E4" }}
        ></i>
        Friends
      </li>
      <li className="rounded p-2 sidebar-hover-color w-100 text-start lh-base">
        <i
          className="pe-2 fs-4 bi bi-clock-fill"
          style={{ color: "#1B74E4" }}
        ></i>
        Memories
      </li>
      <li className="rounded p-2 sidebar-hover-color w-100 text-start lh-base">
        <i className="pe-2 fs-4 bi bi-save2" style={{ color: "#1B74E4" }}></i>
        Saved
      </li>
      <li className="rounded p-2 sidebar-hover-color w-100 text-start lh-base">
        <i
          className="pe-2 fs-4 bi bi-collection"
          style={{ color: "#1B74E4" }}
        ></i>
        Groups
      </li>
      <li className="rounded p-2 sidebar-hover-color w-100 text-start lh-base">
        <i className="pe-2 fs-4 bi bi-tv" style={{ color: "#1B74E4" }}></i>Video
      </li>
      <li className="rounded p-2 sidebar-hover-color w-100 text-start lh-base">
        <i
          className="pe-2 fs-4 bi bi-shop-window"
          style={{ color: "#1B74E4" }}
        ></i>
        Marketplace
      </li>
      <li className="rounded p-2 sidebar-hover-color w-100 text-start lh-base">
        <i
          className="pe-2 fs-4 bi bi-postcard-heart"
          style={{ color: "#1B74E4" }}
        ></i>
        Feeds
      </li>
      <li className="rounded p-2 sidebar-hover-color w-100 text-start lh-base">
        <i
          className="pe-2 fs-4 bi bi-calendar-event"
          style={{ color: "red" }}
        ></i>
        Events
      </li>
      <li className="rounded p-2 sidebar-hover-color w-100 text-start lh-base">
        <i
          className="pe-2 fs-4 bi bi-bar-chart-line-fill"
          style={{ color: "#1B74E4" }}
        ></i>
        Ads Manager
      </li>
      <li className="rounded p-2 sidebar-hover-color w-100 text-start lh-base">
        <i
          className="pe-2 fs-4 bi bi-bullseye"
          style={{ color: "#1B74E4" }}
        ></i>
        Crisis response
      </li>
      <li className="rounded p-2 sidebar-hover-color w-100 text-start lh-base">
        <i className="pe-2 fs-4 bi bi-caret-down-fill"></i>See more
      </li>
    </ul>
  );
}

export default SideBar;
