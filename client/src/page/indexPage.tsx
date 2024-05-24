import React, { useEffect, useState } from "react";
import picture from "../assets/facebookIcon.svg";
import { useMediaQuery } from "../utils/useMediaQuery";
import CreateAccount from "../component/modals/CreateAccount";
import Loading from "../component/Loading";
import { loginHandle, setLoading } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../redux/Store";
import { useNavigate } from "react-router-dom";
import Toast from "../component/Toast";
import Spinner from "../component/Spinner";

function IndexPage() {
  const isTablet = useMediaQuery("(min-width: 767px)");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useAppSelector((state) => state.auth.loading);
  const LoginSuccess = useAppSelector((state) => state.auth.isLoginSuccess);
  const RegisterSuccess = useAppSelector(
    (state) => state.auth.isRegisterSuccess
  );
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (LoginSuccess) {
      navigate("/home");
    }
  }, [LoginSuccess, navigate]);

  const logInHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity()) {
      dispatch(loginHandle(user));
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
      <CreateAccount />
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
                <div className="invalid-feedback">Please input E-mail</div>
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control lh-lg"
                  placeholder="password"
                  name="password"
                  onChange={(e) => handleChange(e)}
                  required
                />
                <div className="invalid-feedback">Please input Password</div>
                {LoginSuccess && (
                  <div className="mt-1 text-danger">
                    Invalid E-mail or Password
                  </div>
                )}
              </div>
              <button
                disabled={isLoading}
                type="submit"
                className="btn btn-primary w-100 lh-lg"
              >
                {isLoading ? <Spinner /> : "Log in"}
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
      <Toast
        message={RegisterSuccess ? "Sign Up Success!" : "Sign Up Failed!"}
        isSuccess={RegisterSuccess}
      />
    </div>
  );
}

export default IndexPage;
