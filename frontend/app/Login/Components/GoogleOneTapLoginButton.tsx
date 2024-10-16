"use client"
import { useEffect, useState, useCallback } from 'react';
import { useOAuth } from '@/app/Context/OAuthContext';
import { useRouter } from 'next/navigation' // ログイン後ページに遷移するためuseRouterを使用
import { axiosInstance } from '@/app/Components/axiosConfig'; // axiosInstanceをインポート


interface GoogleOneTapLoginButton {
  client_id: string
}

const GoogleOneTapLoginButton: React.FC = () => {
  const [hasToken, setHasToken] = useState<boolean>();
  const { setCurrentUser } = useOAuth();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    if (token) {
      setHasToken(true); // トークンが存在する場合;
    } else {
      // Google One Tapウィジェットの初期化を行う
      const initializeGoogleLogin = () => {
        if (typeof window !== "undefined" && window.google && window.google.accounts) {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
          });
          window.google.accounts.id.prompt();
        } else {
          console.error('Google APIが読み込まれていません。');
        }
      };

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = initializeGoogleLogin;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [router]);

  //ここから
  const handleCredentialResponse = useCallback(async (response: any) => {
    console.log('Encoded JWT ID token: ' + response.credential);
    try {
      const accesstoken = response.credential;
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accesstoken}`;
      // バックエンドに送信を定義する部分にaxiosInstanceを適用してコードを簡略化
      const backendResponse = await axiosInstance.post('google_one_tap/callback', {
        token: accesstoken,
      });
      if (backendResponse.status === 200) {
        console.log('ログイン成功:', backendResponse.data);
        const accesstoken = backendResponse.headers['accesstoken']
        // バックエンドでトークン検証が成功したら返されるアプリケーション専用トークンをセッションストレージに格納する。
        // 次回からこのトークンで認証のやりとりをする。
        if (accesstoken) {
          localStorage.setItem('accesstoken', accesstoken);
        }
        const userResponse = await axiosInstance.get('api/v1/users/current');
        setCurrentUser(userResponse.data.user);

        router.push('/AuthorizedEditor');
      }
    } catch (error) {
      console.error('バックエンドのリクエストエラー:',error)
    }

  },[router, setCurrentUser]);
  //ここまで

  return !hasToken && <div id="googleLoginButton"></div>;
};

export default GoogleOneTapLoginButton;

// "use client"
// import { useEffect, useState } from 'react';
// import { useOAuth } from '@/app/Context/OAuthContext';
// import { useRouter } from 'next/navigation' // ログイン後ページに遷移するためuseRouterを使用
// import { axiosInstance } from '@/app/Components/axiosConfig'; // axiosInstanceをインポート


// interface GoogleOneTapLoginButton {
//   client_id: string
// }

// const GoogleOneTapLoginButton: React.FC = () => {
//   const [hasToken, setHasToken] = useState<boolean>();
//   const { setCurrentUser } = useOAuth();
//   const router = useRouter();



//   useEffect(() => {
//     // handleCredentialResponse の定義
//     const handleCredentialResponse = async (response: any) => {
//       console.log('Encoded JWT ID token: ' + response.credential);
//       try {
//         const accesstoken = response.credential;
//         axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accesstoken}`;

//         // バックエンドにトークンを送信して認証を行う
//         const backendResponse = await axiosInstance.post('google_one_tap/callback', {
//           token: accesstoken,
//         });

//         if (backendResponse.status === 200) {
//           console.log('ログイン成功:', backendResponse.data);
//           const accesstoken = backendResponse.headers['accesstoken'];

//           // アクセストークンをセッションストレージに保存
//           if (accesstoken) {
//             sessionStorage.setItem('accesstoken', accesstoken);
//           }

//           // ユーザーデータの取得と状態更新
//           const userResponse = await axiosInstance.get('api/v1/users/current');
//           setCurrentUser(userResponse.data.user);

//           // 認証後のページに遷移
//           router.push('/Authorized');
//         }
//       } catch (error) {
//         console.error('バックエンドのリクエストエラー:', error);
//       }
//     };

//     // トークンのチェック
//     const token = sessionStorage.getItem('accesstoken');
//     if (token) {
//       setHasToken(true); // トークンが存在する場合
//     } else {
//       // Google One Tap ウィジェットの初期化
//       const initializeGoogleLogin = () => {
//         if (typeof window !== 'undefined' && window.google && window.google.accounts) {
//           window.google.accounts.id.initialize({
//             client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//             callback: handleCredentialResponse,
//           });
//           window.google.accounts.id.prompt();
//         } else {
//           console.error('Google APIが読み込まれていません。');
//         }
//       };

//       // Google API スクリプトの読み込み
//       const script = document.createElement('script');
//       script.src = 'https://accounts.google.com/gsi/client';
//       script.async = true;
//       script.onload = initializeGoogleLogin;
//       document.body.appendChild(script);

//       // クリーンアップ関数でスクリプトを削除
//       return () => {
//         document.body.removeChild(script);
//       };
//     }
//   }, [router, setCurrentUser]);

//   return !hasToken && <div id="googleLoginButton"></div>;
// };

// export default GoogleOneTapLoginButton;