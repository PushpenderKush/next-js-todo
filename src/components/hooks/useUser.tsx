import useLocalStorage from "./useLocalStorage";

interface UserData {
  userId: string | null;
}

const useUser = (): { isAuthenticated: boolean; } => {
  const [accessToken] = useLocalStorage("accessToken", null);
  const isAuthenticated: boolean = !!accessToken;


  return { isAuthenticated };
};

export default useUser;
