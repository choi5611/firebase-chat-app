import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import app, { db } from "../../firebase";
import md5 from "md5";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
const RegisterPage = () => {
  const auth = getAuth(app);
  // firebase안쪽에 app을 가져온다.
  // auth는 email,password를 넣어줘야된다.
  const [loading, setLoading] = useState(false);
  // submit 기본상태가 disabled==false 상태여서 회원가입을 처리하는 동안은 다시
  // submit 버튼을 못누르게 하려고 만든 loading State
  const [errorFromSubmit, setErrorFromSubmit] = useState("");
  //에러메세지를 보여줄 State
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  // react-hook-form을 사용하면 기본적으로 제공해주는 handleSubmit가 있다
  // 그렇다면 handleSubmit(onSubmit)으로 data를 받아온다면
  // data.email , data.password data.name 을 받아올 수 있다.
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const createdUser = await createUserWithEmailAndPassword(
        // createUserWithEmailAndPassword 함수는 firebase에서 제공하는 함수다.
        auth,
        data.email,
        data.password
      );
      console.log(createdUser);
      await updateProfile(auth.currentUser, {
        displayName: data.name,
        photoURL: `http://gravatar.com/avatar/${md5(
          createdUser.user.email
        )}?d=identicon`,
      });

      const userData = {
        uid: createdUser.user.uid,
        displayName: createdUser.user.displayName,
        photoURL: createdUser.user.photoURL,
      };
      dispatch(setUser(userData));

      set(ref(db, `users/${createdUser.user.uid}`), {
        name: createdUser.user.displayName,
        image: createdUser.user.photoURL,
      });
      //ref =>경로 ref(db) => 데이터베이스경로
      //db경로에 user의createUser.user.uid를 name과image를 넣는다
      //firebase 문법이다.
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
        <h3>Register</h3>
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

        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          {...register("name", { required: true, maxLength: 10 })}
        />
        {errors.name && errors.name.type === "required" && (
          <p>이름은 필수입니다.</p>
        )}
        {errors.name && errors.name.type === "maxLength" && (
          <p>이름은 10자 이상 못넘어갑니다.</p>
        )}

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
        <Link style={{ color: "gray", textDecoration: "none" }} to={"/login"}>
          계정이 있으십니까?
        </Link>
      </form>
    </div>
  );
};

export default RegisterPage;
