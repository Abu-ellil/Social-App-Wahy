import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import axios from "axios";

const token = localStorage.getItem("token");
const apiUrl = 'https://wahy-social-app-api.onrender.com';
// Action Types
const SIGNUP_USER_SUCCESS = "SIGNUP_USER_SUCCESS";
const LOGIN_USER_SUCCESS = "LOGIN_USER_SUCCESS";
const LOGOUT_USER = "LOGOUT_USER";
const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
const UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS";
const GET_USER_AVATAR_SUCCESS = "GET_USER_AVATAR_SUCCESS";
const GET_ALL_POSTS_SUCCESS = "GET_ALL_POSTS_SUCCESS";
const LIKE_POST_SUCCESS = "LIKE_POST_SUCCESS";



// Action Creators
const loginUserSuccess = (userData) => ({
  type: LOGIN_USER_SUCCESS,
  payload: userData,
});

const logoutUser = () => ({
  type: LOGOUT_USER,
});
export const updateUserRequest = () => ({
  type: "UPDATE_USER_REQUEST",
});
export const updateUserFailure = (error) => ({
  type: "UPDATE_USER_FAILURE",
  payload: error,
});
const addPostSuccess = (post) => ({
  type: ADD_POST_SUCCESS,
  payload: post,
});

const addCommentSuccess = (comment) => ({
  type: ADD_COMMENT_SUCCESS,
  payload: comment,
});

// Action Creators
const signupUserSuccess = (userData) => ({
  type: SIGNUP_USER_SUCCESS,
  payload: userData,
});

// Action Creator
const updateUserSuccess = (userData) => ({
  type: UPDATE_USER_SUCCESS,
  payload: userData,
});
const getAllPostsSuccess = (posts) => ({
  type: GET_ALL_POSTS_SUCCESS,
  payload: posts,
});
const updatePostsSuccess = (posts) => ({
  type: GET_ALL_POSTS_SUCCESS,
  payload: posts,
});
const likePostSuccess = (postId, isLiked) => ({
  type: LIKE_POST_SUCCESS,
  payload: { postId, isLiked },
});

// Initial State
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  posts: [], 
  comments: [], 
  likes:[]
};


// Async Action Creator
const getAllPosts = (page = 1) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/posts?page=${page}`
      );

      // Extract the total pages from the response headers
      const totalPages = parseInt(response.headers["x-total-pages"], 10);

      dispatch(getAllPostsSuccess(response.data, totalPages));
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Handle error if needed
    }
  };
};


const updatePosts = (page = 1) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/posts?page=${page}`
      );

      // Extract the total pages from the response headers
      const totalPages = parseInt(response.headers["x-total-pages"], 10);

      dispatch(updatePostsSuccess(response.data, totalPages));
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Handle error if needed
    }
  };
};

// Async Action Creator
const updateUser = (userData) => {
  return async (dispatch) => {
    try {
      dispatch(updateUserRequest()); // Dispatch loading action

      const response = await axios.patch(
        `${apiUrl}/users/me/${userData._id}`,
        userData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      dispatch(updateUserSuccess(response.data));
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      console.error("Error updating user information:", error);
    }
  };
};


// Async Action Creator
const signupUser = (userData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        "${apiUrl}/users/signup",
        userData
      );
      dispatch(signupUserSuccess(response.data.user));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      console.error("Error signing up:", error);
      // Handle signup failure if needed
    }
  };
};

// Async Action Creator
const loginUser = (credentials) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        "${apiUrl}/users/login",
        credentials
      );
      dispatch(loginUserSuccess(response.data.user));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user data in local storage
    } catch (error) {
      console.error("Error logging in:", error);
      // Dispatch an action to handle login failure if needed
    }
  };
};

// Async Action Creator
const getUserAvatar = (userId) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${apiUrl}/users/${userId}/avatar`
      );
      const avatarData = response.data; // Assuming the image data is in the response

      dispatch({ type: GET_USER_AVATAR_SUCCESS, payload: avatarData });
    } catch (error) {
      console.error("Error fetching avatar:", error);
      // Handle the error appropriately, e.g., dispatch an error action or display an error message
    }
  };
};
const likePost = (postId, userId, isLiked) => {
  return async (dispatch) => {
    try {
      // Make the API call to like/unlike the post
      await axios.post(`${apiUrl}/api/posts/${postId}/like`, {
        userId,
      });

      // Dispatch the action to update the state with the new liked status
      dispatch(likePostSuccess(postId, isLiked));
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      // Handle error if needed
    }
  };
};


// Reducer

// Reducer

const addPost = (postFormData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        "${apiUrl}/api/posts",
        postFormData
      );
      dispatch(addPostSuccess(response.data));
    } catch (error) {
      console.error("Error adding post:", error);
      // Handle error if needed
    }
  };
};

const addComment = (postId, commentData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/posts/${postId}/comments`,
        commentData
      );
      dispatch(addCommentSuccess(response.data));
    } catch (error) {
      console.error("Error adding comment:", error);
      // Handle error if needed
    }
  };
};

// Reducer
// Reducer
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SIGNUP_USER_SUCCESS":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGIN_USER_SUCCESS":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT_USER":
      localStorage.removeItem("user");
      return {
        ...state,
        user: null,
      };
    case "UPDATE_USER_SUCCESS":
      return {
        ...state,
        user: action.payload,
      };
    case "GET_ALL_POSTS_SUCCESS":
      return {
        ...state,
        posts: action.payload.posts,
        totalPages: action.payload.totalPages, // Add totalPages to the state
      };
    
    case "ADD_POST_SUCCESS":
      return { ...state, posts: [...state.posts, action.payload] };
    case "ADD_COMMENT_SUCCESS":
      return { ...state, comments: [...state.comments, action.payload] };
    default:
      return state;
  }
};

// Create the Redux store
const store = createStore(rootReducer, applyMiddleware(thunk));

export {
  store,
  loginUser,
  signupUser,
  logoutUser,
  updateUser,
  addPost,
  addComment,
  getUserAvatar,
  getAllPosts,
  updatePosts,
  likePost,
  
};
