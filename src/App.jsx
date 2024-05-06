import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import ChatPage from "./pages/ChatPage/ChatPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import React, { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "./firebase";
import { useDispatch } from "react-redux";
import { clearUser, setUser } from "./store/userSlice";
// import "bootstrap/dist/css/bootstrap.min.css";

// getAuth 함수는 Firebase 앱과 연결된 인증 객체를 가져오고,
// onAuthStateChanged(firebase기본제공함수) 함수는
// 사용자의 인증 상태가 변경될 때마다 호출되는 콜백을 등록합니다.
function App() {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      //auth => firebase안에 등록된 정보
      //auth 안에 user의 State(인증상태)가 변할때마다 이 콜백함수가 호출이 된다.
      if (user) {
        navigate("/");
        //user의 인증상태가 로그인 상태가 되어있다? == Home으로

        dispatch(
          setUser({
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          })
        );
        //action을 dispatch하면 reducer 함수가 호출이 되고
        //reducer 함수에서 return이 되는 값이 store에 들어있는 state의 값을
        //변경해주고 그 다음에 그 state를 사용하고있는 component를 리렌더링이 일어나서
        //화면이 변화가 나올것임
      } else {
        navigate("/login");
        dispatch(clearUser());
        //user의 인증상태가 로그아웃 상태가 되어있다? == loginPage로
      }
    });
    return () => {
      unsubscribe();
      //컴포넌트가 언마운트될 때 멈추게함(없애버림?)
    };
  }, []);
  return (
    <Routes>
      <Route path="/" element={<ChatPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
