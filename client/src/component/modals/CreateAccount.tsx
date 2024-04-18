import React, { useCallback, useEffect, useState } from "react";
import { parseISO, format, parse } from "date-fns";
import FileDropzone from "../DropZone";
import { UserType } from "../../type";
import { Toast } from "bootstrap";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../../redux/Store";
import { editProfile, registerHandle } from "../../redux/authSlice";
import Spinner from "../Spinner";
import { useParams } from "react-router-dom";

const defaultUserData: UserType = {
  dateOfBirth: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
};

function CreateAccount() {
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [userData, setUserData] = useState({ ...defaultUserData });
  const isLoading = useAppSelector((state) => state.auth.loading);
  const RegisterSuccess = useAppSelector(
    (state) => state.auth.isRegisterSuccess
  );
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const [mode, setMode] = useState("Register");
  const profileDetail = useAppSelector((state) => state.auth.profile);

  useEffect(() => {
    if (params.userId && profileDetail) {
      setMode("Edit");
      setUserData({ ...profileDetail });
    }
  }, [params.userId, profileDetail]);

  useEffect(() => {
    if (dateOfBirth) {
      const parsedDate = parseISO(dateOfBirth);
      const formattedDate = format(parsedDate, "dd MMM yyyy");
      setUserData((prev) => ({
        ...prev,
        dateOfBirth: formattedDate,
      }));
    }
  }, [dateOfBirth]);

  useEffect(() => {
    if (userData.dateOfBirth && mode === "Edit") {
      const parsedDate = parse(userData.dateOfBirth, "d MMM yyyy", new Date());
      const inputValue = format(parsedDate, "yyyy-MM-dd");
      setDateOfBirth(inputValue);
    }
  }, [mode, userData.dateOfBirth]);

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageDataUrl(e.target?.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileAdded = (files: File[]) => {
    setImageFile(files[0]);
  };

  const signUpHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity()) {
      dispatch(
        registerHandle({ user: userData, uploadedFile: imageFile })
      ).finally(() => {
        const toastLiveExample = document.getElementById("liveToast");
        if (toastLiveExample) {
          const toastBootstrap = new Toast(toastLiveExample);
          toastBootstrap.show();
        }
      });
    } else {
      form.classList.add("was-validated");
    }
  };

  const editProfileHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity()) {
      dispatch(
        editProfile({ user: userData, uploadedFile: imageFile })
      ).finally(() => {
        const toastLiveExample = document.getElementById("liveToast");
        if (toastLiveExample) {
          const toastBootstrap = new Toast(toastLiveExample);
          toastBootstrap.show();
        }
      });
    } else {
      form.classList.add("was-validated");
    }
  };

  const submitHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    if (mode === "Register") {
      await signUpHandle(event);
    } else if (mode === "Edit") {
      await editProfileHandle(event);
    }
  };

  const handleReset = useCallback(() => {
    setImageFile(null);
    setImageDataUrl("");

    if (mode === "Register") {
      setUserData(defaultUserData);
      setDateOfBirth("");
    } else if (mode === "Edit" && profileDetail) {
      setUserData({ ...profileDetail });
    }

    const form = document.querySelector(".needs-validation");
    if (form) {
      form.classList.remove("was-validated");
    }
  }, [
    mode,
    setDateOfBirth,
    setUserData,
    profileDetail,
    setImageDataUrl,
    setImageFile,
  ]);

  useEffect(() => {
    if (RegisterSuccess) {
      handleReset();
    }
  }, [RegisterSuccess, handleReset]);

  return (
    <div>
      <div
        className="modal fade"
        id="createAccountModal"
        tabIndex={-1}
        aria-labelledby="createAccountModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <form
            className="needs-validation"
            noValidate
            onSubmit={(e) => submitHandle(e)}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="createAccountModalLabel">
                  {mode === "Register" ? "Sign Up" : "Edit Profile"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    handleReset();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInputFisrtName1"
                      placeholder="First Name"
                      name="firstName"
                      value={userData.firstName}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                    <div className="invalid-feedback">
                      Firstname is required.
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInputSurname1"
                      placeholder="Surname"
                      name="lastName"
                      value={userData.lastName}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                    <div className="invalid-feedback">
                      Lastname is required.
                    </div>
                  </div>
                  <input
                    type="email"
                    className="form-control mt-3"
                    id="exampleInputemail1"
                    placeholder="E-mail"
                    name="email"
                    value={userData.email}
                    onChange={(e) => handleChange(e)}
                    required
                  />
                  <div className="invalid-feedback">E-mail is required.</div>
                  {mode === "Register" && (
                    <>
                      <input
                        type="password"
                        className="form-control mt-3"
                        id="exampleInputPassword1"
                        placeholder="Password"
                        name="password"
                        value={userData.password}
                        onChange={(e) => handleChange(e)}
                        required
                      />
                      <div className="invalid-feedback">
                        Password is required.
                      </div>
                    </>
                  )}
                  <label htmlFor="exampleInputBirthday1" className="mt-3">
                    Date of birth
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="exampleInputBirthday1"
                    placeholder="Birthday"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                  />
                  <div className="invalid-feedback">
                    Date of birth is required.
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInputLocation"
                      placeholder="Location"
                      name="location"
                      value={userData.location}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                    <div className="invalid-feedback">
                      Location is required.
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInputOccupation"
                      placeholder="Occupation"
                      name="occupation"
                      value={userData.occupation}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                    <div className="invalid-feedback">
                      Occupation is required.
                    </div>
                  </div>
                  {imageFile ? (
                    <div className="position-relative">
                      <i
                        className="bi bi-x-lg hover-cursor position-absolute rounded-circle p-2"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.5)",
                          top: 25,
                          right: 10,
                        }}
                        onClick={() => {
                          setImageFile(null);
                          setImageDataUrl("");
                        }}
                      ></i>
                      <img
                        src={imageDataUrl}
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
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  disabled={isLoading}
                  type="submit"
                  className="btn btn-success"
                  // data-bs-dismiss="modal"
                >
                  {isLoading ? (
                    <Spinner />
                  ) : mode === "Register" ? (
                    "Sign Up"
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
