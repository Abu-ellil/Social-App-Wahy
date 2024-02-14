export const useGetUserID = () => {
  const token = window.localStorage.getItem("token");
  return token
};
