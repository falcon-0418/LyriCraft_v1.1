"use client"
import { useOAuth } from "../Context/OAuthContext";
// import SharedLayout from "../Components/SharedLayout/sharedLayout";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar/sidebar";
import MyEditor from "./Editor/myEditor";

const Authorized = () => {
  const { currentUser } = useOAuth();
  const router = useRouter();

  // const blockBrowserBack = useCallback(() => {
  //   window.history.go(1)
  // }, [])

  useEffect(() => {   // 認証されていない場合はログインページにリダイレクト
    if (!currentUser) {
      router.push('/Login');  // ログインページへリダイレクト
    }
  }, [currentUser, router]);

  // useEffect(() => {
  //   window.history.pushState(null, '', window.location.href)  // 直前の履歴に現在のページを追加
  //   window.addEventListener('popstate', blockBrowserBack)   // 直前の履歴と現在のページのループ
  //   return () => {  // クリーンアップは忘れない
  //       window.removeEventListener('popstate', blockBrowserBack)
  //   }
  // }, [blockBrowserBack])

  if (!currentUser) {
    return null;  // currentUserがいない間は何も表示しない
  }

  return(
    <div className="flex">
      <Sidebar/>
      <MyEditor/>
    </div>
  );
}

export default Authorized;