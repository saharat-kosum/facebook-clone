import React, { useState } from "react";
import picture from "../assets/facebookIcon.svg";
import { useMediaQuery } from "../utils/useMediaQuery";
import CreateAccount from "../component/modals/CreateAccount";
import Loading from "../component/Loading";
import axios, { AxiosError } from "axios";
import { setLoading, setLogIn, setToken } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../redux/Store";
import { useNavigate } from "react-router-dom";

function IndexPage() {
  const isTablet = useMediaQuery("(min-width: 767px)");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoginFailed, setIsLoginFailed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useAppSelector((state) => state.auth.loading);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const saveToken = (value: string) => {
    sessionStorage.setItem("userToken", value);
    navigate("/home");
  };

  const logInHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity()) {
      dispatch(setLoading(true));
      try {
        const response = await axios.post(`/auth/login`, user);
        const data = await response.data;

        dispatch(setLogIn(data.user));
        dispatch(setToken(data.token));
        saveToken(data.token);
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status) {
            setIsLoginFailed(true);
          }
        }
      } finally {
        dispatch(setLoading(false));
      }
    } else {
      dispatch(setLoading(false));
      form.classList.add("was-validated");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="container" style={{ height: "100vh" }}>
      <CreateAccount setIsSuccessFull={setIsSuccess} />
      <Loading isShow={isLoading} />
      <div
        className={`d-flex justify-content-evenly align-items-center ${
          isTablet ? "" : "flex-column gap-4"
        }`}
        style={{ height: isTablet ? "70vh" : "unset" }}
      >
        <div className={`${isTablet ? "w-50 " : "mt-5 text-center"} `}>
          <img src={picture} alt="facebook logo" style={{ width: "270px" }} />
          <h2 className="">
            Facebook helps you connect and share with the people in your life.
          </h2>
        </div>
        <div className="text-center">
          <div
            className="border rounded p-3 shadow mb-4"
            style={{ backgroundColor: "white" }}
          >
            <form
              className="needs-validation"
              noValidate
              onSubmit={(e) => logInHandle(e)}
            >
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control lh-lg"
                  placeholder="Email address"
                  name="email"
                  onChange={(e) => handleChange(e)}
                  required
                />
                <div className="invalid-feedback">E-mail is required.</div>
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control lh-lg"
                  placeholder="Password"
                  name="password"
                  onChange={(e) => handleChange(e)}
                  required
                />
                <div className="invalid-feedback">Password is required.</div>
                {isLoginFailed && (
                  <div className="mt-1 text-danger">
                    Invalid E-mail or Password
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary w-100 lh-lg">
                Log in
              </button>
            </form>
            <p className="mt-2">Forgotten password?</p>
            <div className="border-bottom"></div>
            <div
              className="btn btn-success mt-3 lh-lg"
              data-bs-toggle="modal"
              data-bs-target="#createAccountModal"
            >
              Create new account
            </div>
          </div>
          <b>Create a Page</b> for a celebrity, brand or business.
        </div>
      </div>
      <div
        className={`toast align-items-center position-fixed end-0 bottom-0 mx-sm-5 mb-4 mx-1`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        id="liveToast"
        style={{ zIndex: "9999" }}
      >
        <div className="d-flex">
          <div className="toast-body">
            {isSuccess ? "Sign Up Success!" : "Sign Up Failed!"}
          </div>
          <button
            type="button"
            className="btn-close me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  );
}

export default IndexPage;
