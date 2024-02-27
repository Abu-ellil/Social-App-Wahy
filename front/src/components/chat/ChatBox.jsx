import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ChatContext } from "../../context/chatContext";
import { useGetChatUser } from "../../hooks/useGetChatUser";
import { FiSend } from "react-icons/fi";
import { IoCall, IoVideocam } from "react-icons/io5";
import { Stack } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import InputEmoji from "react-input-emoji";
import moment from "moment";
import { io } from "socket.io-client";

const ChatBox = () => {
  const user = useSelector((state) => state.user);
  const {
    currentChat,
    messages,
    isMessagesLoading,
    sendTextMessage,
    onlineUsers,
    startCall,
  } = useContext(ChatContext);
  const { secondUser } = useGetChatUser(currentChat, user);
  const [textMessage, setTextMessage] = useState("");
  const scroll = useRef();
  const [socket, setSocket] = useState(null);
  const userVideo = useRef();
  const peerConnection = useRef(null);

  // const [localStream, setLocalStream] = useState(null);

  // // Function to start capturing the local media stream
  // const startMediaStream = useCallback(async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: true,
  //     });
  //     setLocalStream(stream);

  //     // Assuming you have a video element with the id 'localVideo'
  //     const localVideo = document.getElementById("localVideo");

  //     if (localVideo) {
  //       localVideo.srcObject = stream;
  //     } else {
  //       console.error("Local video element not found.");
  //     }

  //     // ... (any additional logic you might need for handling the stream)
  //   } catch (error) {
  //     console.error("Error accessing user media:", error);
  //   }
  // }, []);

  // // useEffect to start capturing the local media stream when the component mounts
  // useEffect(() => {
  //   startMediaStream();

  //   // Cleanup function to stop the local media stream when the component unmounts
  //   return () => {
  //     if (localStream) {
  //       localStream.getTracks().forEach((track) => track.stop());
  //     }
  //   };
  // }, [startMediaStream, localStream]);










  useEffect(() => {
    const newSocket = io("http://localhost:3003");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket !== null) {
      socket.on("incomingCall", (data) => {
        const acceptCall = window.confirm(
          `Incoming ${data.callType} call from ${secondUser?.username}. Accept?`
        );
        if (acceptCall) {
          handleAcceptCall(data.from, data.signal);
        }
      });
    }
    return () => {
      if (socket !== null) {
        socket.off("incomingCall");
      }
    };
  }, [socket, secondUser]);

  const handleAcceptCall = async (callerId, signal) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    userVideo.current.srcObject = stream;

    const peerConnection = new RTCPeerConnection();

    peerConnection.ontrack = (event) => {
      const remoteVideo = document.createElement("video");
      remoteVideo.srcObject = event.streams[0];
      remoteVideo.autoplay = true;
      document.getElementById("remote-videos").appendChild(remoteVideo);
    };

    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(signal)
    );
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit("answerCall", { to: callerId, signal: answer });
  };

  const handleStartVoiceCall = () => {
    startCall(secondUser?._id, "voice");
  };

  const handleStartVideoCall = () => {
    startCall(secondUser?._id, "video");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage(textMessage, user, currentChat._id, setTextMessage);
    }
  };

  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        <strong>{secondUser?.username}</strong>
      </div>

      <div>
        <video ref={userVideo} autoPlay playsInline />
        <div id="remote-videos"></div>
      </div>

      {/* <video id="localVideo" autoPlay playsInline></video> */}

      <Stack gap={3} className="messages">
        {isMessagesLoading ? (
          <p style={{ textAlign: "center", widows: "100%" }}>Loading Chat...</p>
        ) : messages ? (
          messages.map((message, index) => (
            <Stack
              ref={scroll}
              key={index}
              className={`${
                message.senderId === user?._id
                  ? "message self align-self-end flex-grow-0"
                  : "message align-self-start flex-grow-0"
              }`}
            >
              <span>{message.text}</span>
              <span className="message-footer">
                {moment(message.createdAt).format("YYYY-MM-DD HH:mm:ss")}
              </span>
            </Stack>
          ))
        ) : null}
      </Stack>

      <Stack gap={3} direction="horizontal" className="chat-input flex-grow-0">
        <button onClick={handleStartVoiceCall}>
          <IoCall />
        </button>
        <button onClick={handleStartVideoCall}>
          <IoVideocam />
        </button>
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="Roboto, Tajawal"
          borderColor="rgba(72,112,223,0.2"
          onKeyDown={handleKeyDown}
        />
        <button
          className="send-btn"
          onClick={() =>
            sendTextMessage(textMessage, user, currentChat._id, setTextMessage)
          }
        >
          <FiSend />
        </button>
      </Stack>
    </Stack>
  );
};

export default ChatBox;
