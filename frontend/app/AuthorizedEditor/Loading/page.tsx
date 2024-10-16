"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    history.replaceState(null, document.title, window.location.pathname);
    // 履歴をクリアするために、リダイレクトを遅延させる
    setTimeout(() => {
        history.replaceState(null, document.title, '/Authorized');
      router.replace('/Authorized'); // Authorizedページにリダイレクト
    }, 100); // 100msの遅延
  }, [router]);

  return <div>Loading, please wait...</div>;
}
