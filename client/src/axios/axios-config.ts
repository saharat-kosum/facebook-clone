import axios from "axios";

const setupAxiosInterceptors = (token: string | null) => {
  axios.defaults.baseURL = process.env.REACT_APP_PREFIX_URL;

  if (token && token.length > 0) {
    axios.interceptors.request.use(
      function (config) {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }
};

export default setupAxiosInterceptors;
