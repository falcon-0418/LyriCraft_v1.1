"use client"
import { useOAuth } from "@/app/Context/OAuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { AiOutlineMenuFold } from "react-icons/ai";

export default function Header() {
  const { logout } = useOAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    setIsLoggedIn(!token);
  },[])

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLoginClick = () => {
    const token = localStorage.getItem("accesstoken")
    if (token) {
      router.push("/AuthorizedEditor")
    } else {
      router.push("/Login")
    }
  }

  const handleLogoutClick = () => {
    logout();
    setIsLoggedIn(!false)
    router.push("/")
  }

  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-gray-100 z-50">
      <Link href="/" className="text-2xl font-bold text-gray-800 hover:bg-gray-200 p-2 rounded">HOME</Link>
      <div className="sm:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-gray-200 rounded sm:hidden">
          <AiOutlineMenuFold size={30} />
        </button>
        <div className={`fixed inset-0 ${isOpen ? 'block' : 'hidden'} sm:hidden`} onClick={handleClose}></div>
      </div>

      <div className={`absolute top-12 right-5 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} sm:hidden`}>
        { isLoggedIn ? (
          <span onClick={handleLoginClick} className="block px-4 py-2 text-white bg-blue-500 hover:bg-blue-200 p-1 rounded">ログイン</span>
        ) : (
          <>
            <span onClick={handleLogoutClick} className="block px-4 py-2 text-white bg-red-500 hover:bg-red-200 p-1 rounded">ログアウト</span>
          </>
        )}

      </div>
      <div className="hidden sm:flex space-x-4 ">
        { isLoggedIn ? (
          <span onClick={handleLoginClick} className="text-white bg-blue-500 hover:bg-blue-200 p-2 rounded cursor-pointer">ログイン</span>
        ) : (
          <>
            <span onClick={handleLogoutClick} className="text-white bg-red-500 hover:bg-red-200 p-2 rounded cursor-pointer">ログアウト</span>
          </>
        )}
      </div>
    </header>
  );
}
