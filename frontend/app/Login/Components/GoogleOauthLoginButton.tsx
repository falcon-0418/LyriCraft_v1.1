"use client"
import { useRouter } from 'next/navigation';

const GoogleOauthLoginButton: React.FC = () => {
  const router = useRouter();

  const handleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_LYRICRAFT_APP_URL;
    const oauth2Endpoint = `${apiUrl}/auth/google_oauth2`;
    const params = {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      response_type: 'code',
      scope: 'openid email profile',
      state: 'state_parameter_passthrough_value',
      prompt: 'select_account',
    };

    const urlParams = new URLSearchParams(params).toString();
    const authUrl = `${oauth2Endpoint}?${urlParams}`;

    if (router) {
      window.location.href = authUrl;
    }
  };

  return (
    <button onClick={handleLogin} className='bg-blue-500 text-white text-[16px] py-3 px-7 rounded-[40px]'>
      Custom Google Login
    </button>
  );
};

export default GoogleOauthLoginButton;
