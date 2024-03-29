import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER, SET_CURRENT_ADMIN, USER_LOADING } from "./types";

// Register User
export const registerUser = (userData) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => {
      const Data = {
        _id: res.data._id,
        eventType: {
          festival: false,
          fete: false,
          hotel: false,
          proEvent: false,
          animation: false,
          publicEvent: false,
          privateEvent: false,
        },
        progress: 0,
        isValid: false,
      };

      const newData = Object.assign(Data, userData);

      axios.post("/api/verify/send", newData)
        .catch(() => {
          if (userData.type === "Artist") {
            axios.post("/api/artists/registerArtist", newData)
              .then(() => {
                axios.post("/api/users/login", userData)
                  .then(res => {
                    // Set token to localStorage
                    const { token } = res.data;
                    localStorage.setItem("jwtToken", token);
                    // Set token to Auth header
                    setAuthToken(token);
                    // Decode token to get user data
                    const decoded = jwt_decode(token);
                    // Set current user
                    dispatch(setCurrentUser(decoded));
                    // reload page
                    window.location.reload();
                  }).catch(err => console.log(err))
              })
              .catch(err => console.log(err))
          }
        })
    })
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    )
};

export const confirmUser = (userData) => dispatch => {
  axios.post("/api/verify/send", userData)
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    )
};

// Change Password
export const updatePassword = (userData) => dispatch => {
  axios
    .post("/api/users/updatePassword", userData)
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    );
};

// Login - get admin token
export const loginAdmin = (userData) => dispatch => {
  axios.post("/api/admins/login", userData)
    .then(res => {
      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtAdminToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get admin data
      const decoded = jwt_decode(token);
      // Set current admin
      dispatch(setCurrentAdmin(decoded));
    })
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    )
};

// Login - get user token
export const loginUser = (userData) => dispatch => {
  axios.post("/api/users/login", userData)
    .then(res => {
      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    )
  ;
};

// Login with admin account - get user token
export const loginUserWithAdmin = (userData) => dispatch => {
  axios.post("/api/users/adminLogin", userData)
    .then(res => {
      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    )
  ;
};

// Set logged in admin
export const setCurrentAdmin = decoded => {
  return {
    type: SET_CURRENT_ADMIN,
    payload: decoded
  };
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token and user data from local storage
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("final");
  localStorage.removeItem("currentBtn");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

// Log admin out
export const logoutAdmin = () => dispatch => {
  // Remove token and user data from local storage
  localStorage.removeItem("jwtAdminToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentAdmin({}));
};

export const restorePassword = (user) => dispatch => {
  axios.post("/api/verify/ForgotPassword", user)
    .catch(err => 
      dispatch({
        type: "GET_ERRORS",
        payload: err
      })
    )
}