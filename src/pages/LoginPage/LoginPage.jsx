import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import app from "../../firebase";

const LoginPage = () => {
  const auth = getAuth(app);
  // firebase안쪽에 app을 가져온다.
  // auth는 email,password를 넣어줘야된다.
  const [loading, setLoading] = useState(false);
  // submit 기본상태가 disabled==false 상태여서 회원가입을 처리하는 동안은 다시
  // submit 버튼을 못누르게 하려고 만든 loading State
  const [errorFromSubmit, setErrorFromSubmit] = useState("");
  //에러메세지를 보여줄 State
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      console.log(error);
      setErrorFromSubmit(error.message); //에러메세지를 담는setState
      setTimeout(() => {
        setErrorFromSubmit("");
      }, 3000); // 에러메세지는 3초 후 사라지게하는 Timeout 함수
    } finally {
      setLoading(false);
    }
  };
  // 비동기로 요청할것이라 async await

  return (
    <div className="auth-wrapper">
      <div style={{ textAlign: "center" }}>
        <h3>Login</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>이메일은 필수 입니다.</p>}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          {...register("password", { required: true, minLength: 6 })}
        />
        {errors.name && errors.name.type === "required" && (
          <p>비밀번호는 필수입니다.</p>
        )}
        {errors.name && errors.name.type === "minLength" && (
          <p>비밀번호는 최소 6자 이상 넘어가야 됩니다.</p>
        )}
        {errorFromSubmit && <p>{errorFromSubmit}</p>}
        {/* 에러메세지가 있으면? p태그를 이용해 에러메세지를 보여줘라 */}
        <input type="submit" disabled={loading} />
        <Link
          style={{ color: "gray", textDecoration: "none" }}
          to={"/register"}
        >
          계정 새로 만들기
        </Link>
      </form>
    </div>
  );
};

export default LoginPage;
