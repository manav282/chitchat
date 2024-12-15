import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { IoMdVideocam,IoMdMusicalNotes,IoIosImage,IoIosCopy } from 'react-icons/io'
import { FaMicrophoneSlash, FaMicrophone } from 'react-icons/fa'
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [f, setF] = useState(null);
  const [video, setVideo] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isRecording, setisRecording] = useState(false);
  const [isSending,setisSending]=useState(false);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const microphone = new SpeechRecognition();

  microphone.continuous = true;
  microphone.interimResults = true;
  microphone.lang = "en-US";

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    setisSending(true);
    if (img) {
      const storageRef = ref(storage, uuid());
                           
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.then(
        () => {
          setisSending(false);
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } 
    else if(video)
    {
      const storageRef = ref(storage, uuid());
                       
      const uploadTask = uploadBytesResumable(storageRef, video);

      uploadTask.then(
        () => {
          setisSending(false);
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                video: downloadURL,
              }),
            });
          });
        }
      );
    }
    else if(audio)
    {
      const storageRef = ref(storage, uuid());
      console.log("Audio Selected");                 
      const uploadTask = uploadBytesResumable(storageRef, audio);

      uploadTask.then(
        () => {
          setisSending(false);
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                audio: downloadURL,
              }),
            });
          });
        }
      );
    }
    else if(f)
    {
      const storageRef = ref(storage, uuid());
      console.log("File Selected");                 
      const uploadTask = uploadBytesResumable(storageRef, f);
      const fileName=document.getElementById("file4").value;

      uploadTask.then(
        () => {
          setisSending(false);
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                f: downloadURL,
                fileName:fileName,
              }),
            });
          });
        }
      );
    }
    else {
      setisSending(false);
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    console.log("Uploaded successfully");
    setText("");
    setImg(null);
    setVideo(null);
    setAudio(null);
    setF(null);
  };

  const startRecordController = () => {
    if (isRecording) {
      microphone.start();
    } else {
      microphone.stop();
      microphone.onend = () => {
        console.log("Stopped microphone on Click");
      };
    }

    microphone.onresult = (event) => {
      const recordingResult = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      console.log(recordingResult);
      setText(recordingResult);
      microphone.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  useEffect(() => {
    startRecordController();
  }, [isRecording]);

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])} accept="image/*"
        />
        <label htmlFor="file">
          <IoIosImage size={30} style={{cursor:"pointer"}} />
        </label>

        <input
          type="file"
          style={{ display: "none" }}
          id="file2"
          onChange={(e) => setVideo(e.target.files[0])}
        />
        <label htmlFor="file2">
          <IoMdVideocam size={30} style={{cursor:"pointer"}} />
        </label>

        <input
          type="file"
          style={{ display: "none" }}
          id="file3"
          onChange={(e) => setAudio(e.target.files[0])} accept="audio/*"
        />
        <label htmlFor="file3">
          <IoMdMusicalNotes size={30} style={{cursor:"pointer"}} />
        </label>

        <input
          type="file"
          style={{ display: "none" }}
          id="file4"
          onChange={(e) => setF(e.target.files[0])} accept="application/pdf"
        />
        <label htmlFor="file4">
          <IoIosCopy size={30} style={{cursor:"pointer"}} />
        </label>

        <button onClick={() => setisRecording((prevState) => !prevState)}>
          {isRecording ? <FaMicrophoneSlash size={20} /> : <FaMicrophone size={20} />}
        </button>
        <button onClick={handleSend}>{isSending?"Sending":"Send"}</button>
      </div>
    </div>
  );
};

export default Input;
