import React, { useState, useRef } from "react";
import {
  child,
  push,
  set,
  ref as dbRef,
  serverTimestamp,
  remove,
} from "firebase/database";
import { db, storage } from "../../../firebase";
import { useSelector } from "react-redux";
import {
  ref as strRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { ProgressBar } from "react-bootstrap";
const MessageForm = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [percentage, setPercentage] = useState(0);

  const messageRef = dbRef(db, "messages");
  const inputOpenImageRef = useRef(null);

  const { currentChatRoom } = useSelector((state) => state.chatRoom);
  const { currentUser } = useSelector((state) => state.user);
  const { isPrivateChatRoom } = useSelector((state) => state.chatRoom);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) {
      setErrors((prev) => prev.concat("type Contents First"));
      return;
    }
    setLoading(true);
    try {
      await set(push(child(messageRef, currentChatRoom.id)), createMessage());

      setLoading(false);
      setContent("");
      setErrors([]);
    } catch (error) {
      setErrors((prev) => prev.concat(error.message));
      setLoading(false);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  };

  const createMessage = (fileUrl = null) => {
    const message = {
      timestamp: serverTimestamp(),
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        image: currentUser.photoURL,
      },
    };
    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = content;
    }
    return message;
  };
  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };
  const getPath = () => {
    if (isPrivateChatRoom) {
      return `/message/private/${currentChatRoom.id}`;
    } else {
      return `/message/public`;
    }
  };

  const handleUploadImage = (event) => {
    const file = event.target.files[0];

    // firebase에서 제공하는 예시
    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: file.type,
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = strRef(storage, `${getPath()}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // 업로드 진행률
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setPercentage(Math.round(progress));

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

          set(
            push(child(messageRef, currentChatRoom.id)),
            createMessage(downloadURL)
          );
          setLoading(false);
        });
      }
    );
  };

  const handleChange = (event) => {
    setContent(event.target.value);

    if (event.target.value) {
      set(dbRef(db, `typing/${currentChatRoom.id}/${currentUser.uid}`), {
        userUid: currentUser.displayName,
      });
    } else {
      remove(dbRef(db, `typing/${currentChatRoom.id}/${currentUser.uid}`));
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          style={{
            width: "100%",
            height: 90,
            border: "0.2rem slid rgb(235,236,236)",
            borderRadius: 4,
          }}
          value={content}
          onChange={handleChange}
        />
        {!(percentage === 0 || percentage === 100) && (
          <ProgressBar
            variant="warning"
            label={`${percentage}`}
            now={percentage}
          />
        )}

        <div>
          {errors.map((errorMsg, i) => (
            <p style={{ color: "red" }} key={i}>
              {errorMsg}
            </p>
          ))}
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flexGrow: 1 }}>
            <button
              className="message-form-button"
              type="submit"
              style={{ width: "100%", fontSize: 20, fontWeight: "bold" }}
              disabled={loading}
            >
              보내기
            </button>
          </div>
          <div style={{ flexGrow: 1 }}>
            <button
              type="button"
              className="message-form-button"
              onClick={handleOpenImageRef}
              style={{ width: "100%", fontSize: 20, fontWeight: "bold" }}
              disabled={loading}
            >
              이미지
            </button>
          </div>
        </div>
      </form>

      <input
        type="file"
        accept="image/jpeg, image/png"
        style={{ display: "none" }}
        ref={inputOpenImageRef}
        onChange={handleUploadImage}
      />
    </div>
  );
};

export default MessageForm;
