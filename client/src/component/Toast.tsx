interface ToastProps {
  message: string;
  isSuccess: boolean;
}

function Toast({ message, isSuccess }: ToastProps) {
  return (
    <div
      className={`toast align-items-center position-fixed end-0 bottom-0 mx-sm-5 mb-4 mx-1 text-white ${
        isSuccess ? "bg-success" : "bg-danger"
      }`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      id="liveToast"
      style={{ zIndex: "9999" }}
    >
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button
          type="button"
          className="btn-close me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
}

export default Toast;
