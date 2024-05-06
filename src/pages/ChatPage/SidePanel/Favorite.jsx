import React, { useState, useEffect } from "react";
import { FaRegSmileBeam } from "react-icons/fa";
import { onChildAdded, child, off, onChildRemoved } from "firebase/database";
import { ref } from "firebase/database";
import { db } from "./../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../store/chatRoomSlice";
const Favorite = () => {
  const [favoriteChatRooms, setFavoriteChatRooms] = useState([]);
  const [activeChatRoomId, setActiveChatRoomId] = useState("");

  const usersRef = ref(db, "users");
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (currentUser?.uid) {
      addListener(currentUser.uid);
    }

    return () => {
      removeListener(currentUser.uid);
    };
  }, [currentUser?.uid]);

  const removeListener = (userId) => {
    off(child(usersRef, `${userId}/favorite`));
  };

  const addListener = (userId) => {
    let favoriteArray = [];
    onChildAdded(child(usersRef, `${userId}/favorite`), (DataSnapshot) => {
      favoriteArray.push({ id: DataSnapshot.key, ...DataSnapshot.val() });
      const newFavoriteChatRooms = [...favoriteArray];

      setFavoriteChatRooms(newFavoriteChatRooms);
    });

    onChildRemoved(child(usersRef, `${userId}/favorite`), (DataSnapshot) => {
      const filteredChatRoom = favoriteArray.filter((chatRoom) => {
        return chatRoom.id !== DataSnapshot.key;
      });
      favoriteArray = filteredChatRoom;
      setFavoriteChatRooms(filteredChatRoom);
    });
  };

  const changeChatRoom = (room) => {
    dispatch(setCurrentChatRoom(room));
    dispatch(setPrivateChatRoom(false));
    setActiveChatRoomId(room.id);
  };

  const renderFavoriteChatRooms = (favoriteChatRooms) =>
    favoriteChatRooms.length > 0 &&
    favoriteChatRooms.map((chatRoom) => (
      <li
        key={chatRoom.id}
        onClick={() => changeChatRoom(chatRoom)}
        style={{
          backgroundColor: chatRoom.id === activeChatRoomId ? "#ffffff45" : "",
        }}
      >
        #{chatRoom.name}
      </li>
    ));

  return (
    <div>
      <span style={{ display: "flex", alignItems: "center" }}>
        <FaRegSmileBeam />
        FAVORITE
      </span>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {renderFavoriteChatRooms(favoriteChatRooms)}
      </ul>
    </div>
  );
};

export default Favorite;
