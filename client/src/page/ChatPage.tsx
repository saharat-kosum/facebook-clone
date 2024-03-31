import React, { useEffect, useState } from "react";
import { AppDispatch, useAppSelector } from "../redux/Store";
import NavBar from "../component/NavBar";
import Loading from "../component/Loading";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getFriends, getUserDetail } from "../redux/authSlice";
import { ChatHistory, UserType } from "../type";
import { useMediaQuery } from "../utils/useMediaQuery";

function ChatPage() {
  const userData = useAppSelector((state) => state.auth.user);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const prefixWS = process.env.REACT_APP_PREFIX_WS;
  const dispatch = useDispatch<AppDispatch>();
  const [ws, setWs] = useState<null | WebSocket>(null);
  const [message, setMessage] = useState<string>("");
  const [targetUser, setTargetUser] = useState<UserType | undefined>(undefined);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const prefix_img_url = process.env.REACT_APP_PREFIX_URL_IMG;
  const profilePicture = useAppSelector((state) => state.auth.mockIMG);
  const authLoading = useAppSelector((state) => state.auth.loading);
  const token = useAppSelector((state) => state.auth.token);
  const friends = useAppSelector((state) => state.auth.friends);
  const isLaptop = useMediaQuery("(min-width: 1024px)");
  const isMobile = useMediaQuery("(min-width: 425px)");
  const isTablet = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (token && token.length > 0) {
      if (!userData || !userData._id) {
        dispatch(getUserDetail());
      } else {
        dispatch(getFriends(userData._id));
      }
    } else {
      window.location.replace("/");
    }
  }, [token, userData, dispatch]);

  useEffect(() => {
    if (prefixWS && token) {
      const ws = new WebSocket(`${prefixWS}/?token=${token}`);
      setWs(ws);
      ws.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        setChatHistory((prev) => [
          ...prev,
          {
            sender: data.sender,
            message: data.message,
            receiver: data.receiver,
          },
        ]);
      });

      return () => {
        ws.close();
      };
    }
  }, [prefixWS, token]);

  const onClickFriendHandle = async (friend: UserType) => {
    setTargetUser(friend);
    setIsLoadingChat(true);
    try {
      const { data } = await axios.get(`/chats/${friend._id}`);
      setChatHistory(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      ws &&
      targetUser &&
      message.trim() &&
      targetUser._id &&
      userData &&
      userData._id
    ) {
      const newChat: ChatHistory = {
        sender: userData._id,
        receiver: targetUser._id,
        message: message,
      };
      ws.send(JSON.stringify(newChat));
      setChatHistory((prev) => [...prev, newChat]);
      setMessage("");
    }
  };

  return (
    <>
      <NavBar />
      <Loading isShow={authLoading} />
      <div className="d-flex bg-white" style={{ minHeight: "94vh" }}>
        <div className="w-25 border-end">
          <div className="d-flex justify-content-between align-items-center p-2 p-sm-3">
            {isMobile ? <h2>Chats</h2> : <h5>Chats</h5>}
            {isLaptop ? (
              <div className="d-flex gap-3">
                <div
                  className="p-2 fs-5 fw-bold rounded-circle hover-cursor"
                  style={{ backgroundColor: "#F0F2F5" }}
                >
                  <i className="bi bi-three-dots"></i>
                </div>
                <div
                  className="p-2 fs-5 fw-bold rounded-circle hover-cursor"
                  style={{ backgroundColor: "#F0F2F5" }}
                >
                  <i className="bi bi-pencil-square"></i>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <form
            className="d-flex rounded-pill border mb-2 position-relative mx-3"
            style={{ height: "fit-content" }}
          >
            <input
              className="form-control rounded-pill ps-sm-5"
              type="search"
              placeholder={isTablet ? "Search Messenger" : ""}
              aria-label="Search"
              style={{ border: "none", backgroundColor: "#F0F2F5" }}
            />
            <button className="btn position-absolute" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>
          <div className="px-sm-2">
            {friends?.map((friend, index) => (
              <div
                className="p-2 sidebar-hover-color rounded-3 text-center d-md-flex gap-3 align-items-center"
                key={index}
                style={{
                  backgroundColor:
                    targetUser?._id === friend._id ? "#E4E6EB" : "",
                }}
                onClick={() => onClickFriendHandle(friend)}
              >
                <img
                  alt="profile"
                  className="rounded-circle border"
                  src={
                    friend?.picturePath
                      ? prefix_img_url + friend?.picturePath
                      : profilePicture
                  }
                  style={{ width: "56px", height: "56px", objectFit: "cover" }}
                />
                {isTablet && (
                  <span className="">
                    {friend.firstName} {friend.lastName}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        {targetUser && userData ? (
          <div className="w-75 d-flex flex-column">
            <div className="flex-grow-1 d-flex flex-column">
              <div className="shadow-sm p-3 d-flex justify-content-between align-items-center">
                <div className="">
                  <img
                    alt="profile"
                    className="rounded-circle border me-2"
                    src={
                      targetUser.picturePath
                        ? prefix_img_url + targetUser.picturePath
                        : profilePicture
                    }
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />
                  {isMobile && (
                    <span className="">
                      {targetUser.firstName} {targetUser.lastName}
                    </span>
                  )}
                </div>
                <div className="d-flex fs-5" style={{ color: "#007DF2" }}>
                  <i className="bi bi-telephone-fill p-2 hover-cursor"></i>
                  <i className="bi bi-camera-video-fill p-2 mx-1 hover-cursor"></i>
                  <i className="bi bi-info-circle-fill p-2 hover-cursor"></i>
                </div>
              </div>
              <div className="p-3 flex-grow-1 d-flex flex-column justify-content-end overflow-auto">
                {chatHistory.map((chat, index) => (
                  <div
                    className={`${
                      chat.sender === userData._id
                        ? "align-self-end bg-primary"
                        : "bg-secondary"
                    } 
                    mt-1 py-1 px-3 rounded-pill text-white text-break`}
                    style={{ width: "fit-content" }}
                    key={index}
                  >
                    {chat.message}
                  </div>
                ))}
              </div>
            </div>
            <form
              className="d-flex gap-2 mx-3 mb-3"
              onSubmit={(event) => sendMessage(event)}
            >
              <input
                type="text"
                placeholder="Type your message here"
                className="form-control"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
              <button type="submit" className="p-2 btn btn-outline-primary">
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="w-75 d-flex justify-content-center align-items-center text-secondary">
            <p>Please select friend to start chat</p>
          </div>
        )}
      </div>
    </>
  );
}

export default ChatPage;
