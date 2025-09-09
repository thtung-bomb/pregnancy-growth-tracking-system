import { useSelector } from "react-redux";

export const useCurrentUser = () => {
  const user = useSelector((store: any) => store.user);
  console.log(user);
  return user;
};
