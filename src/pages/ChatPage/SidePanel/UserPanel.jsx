import React, { useRef } from "react";
import { IoIosChatboxes } from "react-icons/io";
import { Dropdown, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import app, { db, storage } from "../../../firebase";
import { ref as dbRef, update } from "firebase/database";
import {
  getDownloadURL,
  uploadBytesResumable,
  ref as strRef,
} from "firebase/storage";
import { setPhotoUrl } from "../../../store/userSlice";
const UserPanel = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const auth = getAuth(app);
  const inputOpenImageref = useRef(null);

  const handleLogout = () => {
    signOut(auth) // firebase에서 제공해주는 로그아웃 함수
      .then(() => {}) //비동기이기때문에 요청이 끝나면 실행
      .catch((err) => {
        console.log(err);
      });
  };
  const handleOpenImageRef = () => {
    inputOpenImageref.current.click();
  };

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    const user = auth.currentUser;
    // firebase에서 제공하는 예시
    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: file.type,
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = strRef(storage, "user_image/" + user.uid);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // 업로드 진행률
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          //프로필이미지 수정
          updateProfile(user, {
            photoURL: downloadURL,
          });
          // 리덕스 스토어 이미지 데이터 수정
          dispatch(setPhotoUrl(downloadURL));
          //데이터 베이스
          update(dbRef(db, `users/${user.uid}`), { image: downloadURL });
        });
      }
    );
    //여기까지 firebase에서 제공하는 예시
  };
  return (
    <div>
      <h3 style={{ color: "white" }}>
        <IoIosChatboxes /> Chat App
      </h3>

      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <Image
          src={currentUser.photoURL}
          style={{ width: "30px", height: "30px", marginTop: "3px" }}
          roundedCircle
        />
        <Dropdown>
          <Dropdown.Toggle
            style={{
              background: "transparent",
              border: "0",
            }}
          >
            {currentUser.displayName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleOpenImageRef}>
              프로필 사진 변경
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <input
        onChange={handleUploadImage}
        type="file"
        ref={inputOpenImageref}
        style={{ display: "none" }}
        accept="image/jpeg, image/png"
      />
    </div>
  );
};

export default UserPanel;
