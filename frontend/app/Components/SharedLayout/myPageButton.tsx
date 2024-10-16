"use client"
import { useOAuth } from "@/app/Context/OAuthContext";
import Link from "next/link";

const MyPageButton = () => {
  const { currentUser } = useOAuth();

  // ログインしていない場合は何も表示しない
  if (!currentUser) {
    return null;
  }

  return (
    <Link href="/AuthorizedEditor">
      <button className="text-white text-xl bg-blue-500 hover:bg-blue-200 p-2 rounded">マイページへ</button>
    </Link>
  );
};

export default MyPageButton;
