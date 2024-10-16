import MyPageButton from "./Components/SharedLayout/myPageButton";
import SharedLayout from "./Components/SharedLayout/sharedLayout"
import GoogleOneTapLoginButton from "./Login/Components/GoogleOneTapLoginButton";

export default function TOP() {

  return(
    <SharedLayout>
      <div className="flex flex-col justify-center items-center h-screen">
        <GoogleOneTapLoginButton/>
        <h1 className="text-center text-2xl font-bold">TOPページ</h1>
        <MyPageButton/>
      </div>
    </SharedLayout>
  );
}