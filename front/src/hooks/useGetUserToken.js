export const useGetUserToken = () => {
  const token = window.localStorage.getItem("token");
  return token
};
