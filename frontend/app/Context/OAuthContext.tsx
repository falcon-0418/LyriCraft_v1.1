"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../Components/axiosConfig";
import { AuthContextType, AuthProviderProps } from "../Types/auth";
import { User } from "../Types/object"
import { useRouter } from "next/navigation";
import  { jwtDecode } from 'jwt-decode'



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useOAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if(!context) {
    throw new Error("useAuth は AuthProvider 内で使用する必要があります。")
  }
  return context
}

const isTokenExpired = (token: string): boolean => {
  if (!token || token.trim() === "") {
    return true;
  }
  try {
    const decoded: { exp?: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000; // 現在の時間（秒）
    if (decoded.exp) {
      const expired = decoded.exp < currentTime;
      return expired;
    } else {
      return true;
    }
  } catch (error) {
    return true;
  }
};


export const OAuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const tokenFromUrl = query.get("accesstoken")
    if (tokenFromUrl) {
     setToken(tokenFromUrl);
     localStorage.setItem("accesstoken", tokenFromUrl);

     history.replaceState(null, document.title, window.location.pathname);

    } else {
      const storedToken = localStorage.getItem("accesstoken");
      if (storedToken){
        setToken(storedToken);
      }
    }
  }, []);

  useEffect(() => {
    const checkTokenAndFetchUser = async () => {
      if (token && token !== "") {
        if (isTokenExpired(token)) {
          // トークンが有効期限切れの場合
          console.log("Token expired. Logging out.");
          logout();
        } else {
          try {
            const response = await axiosInstance.get("api/v1/users/current", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setCurrentUser(response.data.user);
          } catch (error) {
            console.error("ユーザーを取得できません:", error);
            logout();
          }
        }
      }
    };

    checkTokenAndFetchUser();
  }, [token]);

  const logout = () => {
    setCurrentUser(null);
    setToken("");
    localStorage.removeItem("accesstoken")
    router.push('/');
  };
  return (
    <AuthContext.Provider value={{ token, logout, setToken, currentUser, setCurrentUser}}>
      {children}
    </AuthContext.Provider>
  )
}
