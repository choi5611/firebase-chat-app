import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: {
    uid: "", //현재 로그인 한 유저의 아이디
    photoURL: "", // 유저의 사진
    displayName: "",
  },
};
//초기값

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser.uid = action.payload.uid;
      state.currentUser.photoURL = action.payload.photoURL;
      state.currentUser.displayName = action.payload.displayName;
      //새로 설정할 사용자 정보, 이 정보를 사용하여 현재 사용자의
      //uid,photoURL,displayName을 업데이트
    },
    clearUser: (state) => {
      state.currentUser = {};
      //사용자 정보를 지우기 위해 빈 배열로 설정함
    },
    setPhotoUrl: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        photoURL: action.payload,
      };
    },
    //state.currentUser의 정보를 나열하고 현재 사용자의 photoURL을 새로운 값으로 업데이트한다.
  },
});
export const { setPhotoUrl, clearUser, setUser } = userSlice.actions;
export default userSlice.reducer;
