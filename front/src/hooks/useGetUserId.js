export const useGetUserId = () => {
  const userString = window.localStorage.getItem("user");
  if (!userString) {
    return null; 
  }
  const user = JSON.parse(userString);
  const userId = user._id;
  return userId;
};
