"use client"
import GoogleOneTapLoginButton from './Components/GoogleOneTapLoginButton';
import GoogleOauthLoginButton from './Components/GoogleOauthLoginButton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("accesstoken")
      if(token) {
        router.replace("/AuthorizedEditor");
      } else {
        setIsLoading(false);
      }
    },[router]);

    if (isLoading) {
      return null;
    }

  return (
    <div className="flex flex-col gap-3 justify-center items-center h-screen">
      <GoogleOneTapLoginButton/>
      <h1 className='text-2xl'>ログインページ</h1>
      <GoogleOauthLoginButton/>
    </div>
  );
}