import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "../utils/useMediaQuery";
import { AppDispatch, useAppSelector } from "../redux/Store";
import { UserType } from "../type";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLogOut } from "../redux/authSlice";

function NavBar() {
  const isTablet = useMediaQuery("(min-width: 570px)");
  const userData = useAppSelector((state) => state.auth.user);
  const prefix_img_url = process.env.REACT_APP_PREFIX_URL_IMG;
  const profilePicture = useAppSelector((state) => state.auth.mockIMG);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchUser, setSearchUser] = useState<UserType[] | undefined>(
    undefined
  );

  const logOutHandle = () => {
    sessionStorage.removeItem("userToken");
    dispatch(setLogOut());
    navigate("/");
  };

  const profile = () => {
    navigate(`/profile/${userData?._id}`);
  };

  const searchHandle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      try {
        const response = await axios.get(
          `/users/search?search=${event.target.value}`
        );
        const data = response.data;
        setSearchUser(data.users);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSearchUser(undefined);
    }
  };

  const clearUsers = () => {
    setSearchUser(undefined);
  };

  return (
    <nav
      className="navbar sticky-top bg-white shadow-sm"
      style={{ height: "6vh", padding: "unset" }}
    >
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <Link
            className="navbar-brand"
            to="/home"
            style={{ color: "inherit", padding: "unset" }}
          >
            <i className="bi bi-facebook fs-1" style={{ color: "#1B74E4" }}></i>
          </Link>
          {isTablet && (
            <form
              className="d-flex rounded-pill border ps-1 position-relative"
              style={{ height: "fit-content" }}
            >
              <input
                className="form-control rounded-pill ps-5"
                type="search"
                placeholder="Search ..."
                aria-label="Search"
                style={{ border: "none" }}
                onChange={(e) => searchHandle(e)}
                onBlur={() => clearUsers()}
              />
              <button className="btn position-absolute" type="submit">
                <i className="bi bi-search"></i>
              </button>
              {searchUser && searchUser.length > 0 ? (
                <ul
                  className="dropdown-menu d-block w-100"
                  style={{ top: "38px" }}
                  onMouseDown={(event: React.MouseEvent) => {
                    event.preventDefault();
                  }}
                >
                  {searchUser.map((user) => (
                    <li>
                      <a
                        className="dropdown-item"
                        href={`/profile/${user._id}`}
                      >
                        <img
                          alt="profile"
                          className="rounded-circle border me-2"
                          src={
                            user?.picturePath
                              ? prefix_img_url + user?.picturePath
                              : profilePicture
                          }
                          style={{
                            width: "36px",
                            height: "36px",
                            objectFit: "cover",
                          }}
                        />
                        {user.firstName} {user.lastName}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </form>
          )}
        </div>
        <ul
          className="d-flex gap-2 fs-5 align-items-center"
          style={{ marginBottom: "unset" }}
        >
          <li>
            <i className="bi bi-list p-2 bg-secondary-subtle rounded-circle hover-cursor"></i>
          </li>
          <li>
            <Link to="/chat" style={{ color: "inherit", padding: "unset" }}>
              <i className="bi bi-chat-dots-fill p-2 bg-secondary-subtle rounded-circle hover-cursor"></i>
            </Link>
          </li>
          <li>
            <i className="bi bi-bell-fill p-2 bg-secondary-subtle rounded-circle hover-cursor"></i>
          </li>
          <li className="btn-group " data-bs-toggle="dropdown">
            <img
              alt="profile"
              className="rounded-circle border hover-cursor"
              src={
                userData?.picturePath
                  ? prefix_img_url + userData?.picturePath
                  : profilePicture
              }
              style={{ width: "38px", height: "38px", objectFit: "cover" }}
            />
            <ul className="dropdown-menu end-0" style={{ left: "unset" }}>
              <li onClick={() => profile()}>
                <div className="dropdown-item hover-cursor">Profile</div>
              </li>
              <li onClick={() => logOutHandle()}>
                <div className="dropdown-item hover-cursor">Log Out</div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
