import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentChatRoom: {
    createdBy: {
      //누구에 의해서 생성이 되었고
      image: "",
      name: "",
    },
    description: "", //채팅룸의 설명
    id: "", //채팅룸의 아이디
    name: "", //채팅룸의 이름
  },
  isPrivateChatRoom: false, //비밀채팅룸인지 아닌지
  userPosts: null, //누가 몇개의 채팅을 작성 했는지
};

export const chatRoomSlice = createSlice({
  name: "chatRoom",
  initialState,
  reducers: {
    //액션생성함수
    setCurrentChatRoom: (state, action) => {
      state.currentChatRoom = action.payload;
    },
    setPrivateChatRoom: (state, action) => {
      state.isPrivateChatRoom = action.payload;
    },
    setUserPosts: (state, action) => {
      state.userPosts = action.payload;
    },
  },
});

export const { setCurrentChatRoom, setPrivateChatRoom, setUserPosts } =
  chatRoomSlice.actions;

export default chatRoomSlice.reducer;
