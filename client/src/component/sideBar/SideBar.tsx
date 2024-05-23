import React from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/Store";

export const sideBarArray = [
  { display: "Friends", icon: "bi-people-fill" },
  { display: "Memories", icon: "bi-clock-fill" },
  { display: "Saved", icon: "bi-save2" },
  { display: "Groups", icon: "bi-collection" },
  { display: "Video", icon: "bi-tv" },
  { display: "Marketplace", icon: "bi-shop-window" },
  { display: "Feeds", icon: "bi-postcard-heart" },
  { display: "Events", icon: "bi-calendar-event" },
  { display: "Ads Manager", icon: "bi-bar-chart-line-fill" },
  { display: "Crisis response", icon: "bi-bullseye" },
  { display: "See more", icon: "bi-caret-down-fill" },
];

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
        style={{
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
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
      {sideBarArray.map((sidebar) => (
        <li
          className="rounded p-2 sidebar-hover-color w-100 text-start lh-base"
          key={sidebar.display}
        >
          <i
            className={`pe-2 fs-4 bi ${sidebar.icon}`}
            style={{ color: "#1B74E4" }}
          ></i>
          {sidebar.display}
        </li>
      ))}
    </ul>
  );
}

export default SideBar;
