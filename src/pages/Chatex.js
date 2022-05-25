import React, { useState, useEffect, useCallback, useRef } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import GoBack from "../elements/GoBack";
import Image from "../elements/Image";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";
import { actionCreators as roomActions } from "../redux/modules/room";
import { useParams } from "react-router-dom";
import { history } from "../redux/configStore";
import ChatMenu from "./ChatMenu";
import { IoSend } from "react-icons/io5";

const token = localStorage.getItem("token");
const socket = io.connect("https://seuchidabackend.shop", {
  auth: {
    auth: token,
  },
});
function Chatex(props) {
  const params = useParams();
  const dispatch = useDispatch();
  const user_list = useSelector((state) => state.room.list?.nowMember);
  const user = useSelector((state) => state.user.userInfo);
  const roomId = params.roomId;
  const [message, setMessage] = useState("");
  const [chatlist, setChatlist] = useState([]);
  const [chat, setChat] = useState([]);
  const [systemMsg, setSystemMsg] = useState([]);
  const [nowM, setnowM] = useState(1);
  const [comModalOn, setcomModalOn] = useState(false);
  const chattingBox = useRef(null);
  const scrollToBottom = () => {
    if (chattingBox.current) {
      chattingBox.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "end",
      });
    }
  };
  const openModal = () => {
    setcomModalOn(true);
    // document.body.style.overflow ="hidden"
  };
  const closecomModal = (e) => {
    setcomModalOn(false);
    // document.body.style.overflow ="unset"
  };

  const roomInfo = props?.location.state;
  const TimeCheck = (t) => {
    let time = t.split(" ")[1];
    let hour = time.split(":")[0];

    if (hour > 12) {
      hour = `오후 ${hour - 12}`;
    } else {
      hour = `오전 ${hour}`;
    }
    return `${hour}:${time.split(":")[1]}`;
  }; //작성시간 변환 함수

  useEffect(() => {
    dispatch(roomActions.getchatMemberDB(roomId));
  }, [systemMsg]);

  useEffect(() => {
    setnowM(user_list?.length);
  }, [user_list]);

  useEffect(() => {
    dispatch(userActions.isLoginDB());
    socket?.emit("join", {
      roomId,
    });
    return;
  }, [roomId]);

  useEffect(() => {
    socket.on("broadcast", (data) => {
      setChat((chat) => chat.concat(data));
      if (data.name === "System") {
        setSystemMsg((systemMsg) => systemMsg.concat(data));
      }
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  useEffect(() => {
    socket.on("chatlist", (data) => {
      setChatlist(data);
    });
  }, [chatlist]);

  const sendMessage = useCallback(
    (e) => {
      if (message) {
        e.preventDefault();
        socket.emit("chat", { roomId, msg: message }, setMessage(""));
      }
    },
    [message]
  );

  const leaveRoom = () => {
    socket.emit("leave", { roomId });
    history.replace("/chatlist");
  };

  return (
    <>
      <ChatMenu
        comModalOn={comModalOn}
        closecomModal={closecomModal}
        roomId={roomId}
        leaveRoom={leaveRoom}
        socket={socket}
      />

      <Header>
        <HeaderContents>
          <RowBox>
            <GoBack
              gback
              _onClick={() => {
                history.goBack();
              }}
            />
            <div style={{ margin: "3px 0px 0px 10px" }}>
              {roomInfo?.postTitle}
            </div>
            <div style={{ margin: "3px 0px 0px 15px", color: "#C4C4C4" }}>
              {nowM}/{roomInfo?.maxMember}
            </div>
          </RowBox>

          <div onClick={openModal}>BUT</div>
        </HeaderContents>
      </Header>

      <Body ref={chattingBox}>
        {/* 이전 채팅  */}
        {chatlist.map((prevChat, index) => {
          return prevChat.name === "System" ? null : prevChat.name ===
            user.nickName ? (
            <IsMe key={`${prevChat.createdAt}+${index}`}>
              <TextBoxMe>{prevChat.msg}</TextBoxMe>
              <TimeBox>{TimeCheck(prevChat.createdAt)}</TimeBox>
            </IsMe>
          ) : (
            <div key={`${prevChat.createdAt}+${index}`}>
              <RowBox>
                <Image src={prevChat.userImg} size={32} />
                <NameBox>{prevChat.name}</NameBox>
              </RowBox>

              <RowBox>
                <TextBox>{prevChat.msg}</TextBox>
                <TimeBox>{TimeCheck(prevChat.createdAt)}</TimeBox>
              </RowBox>
            </div>
          );
        })}

        {/* 라이브 채팅 */}
        {chat.map((chat, index) => {
          return chat.name === "System" ? (
            <SystemMsg key={`${chat.createdAt}+${index}`}>{chat.msg}</SystemMsg>
          ) : chat.name === user.nickName ? (
            <IsMe key={`${chat.createdAt}+${index}`}>
              <TextBoxMe>{chat.msg}</TextBoxMe>
              <TimeBox>{TimeCheck(chat.createdAt)}</TimeBox>
            </IsMe>
          ) : (
            <>
              <div key={`${chat.createdAt}+${index}`}>
                <RowBox>
                  <Image src={chat.userImg} size={32} />
                  <NameBox>{chat.name}</NameBox>
                </RowBox>

                <RowBox>
                  <TextBox>{chat.msg}</TextBox>
                  <TimeBox>{TimeCheck(chat.createdAt)}</TimeBox>
                </RowBox>
              </div>
            </>
          );
        })}
      </Body>
      <Chatting>
        <div>
          <TextMsg
            value={message}
            placeholder="내용을 입력하세요."
            onChange={(e) => setMessage(e.target.value)}
          />

          <Send onClick={sendMessage}>
            <IoSend size={25} color="#787878" />
          </Send>
        </div>
      </Chatting>
    </>
  );
}

export default Chatex;
const Header = styled.div`
  height: 95px;
  top: 0;
  position: fixed;
  border-bottom: 1px solid #e6e6e6;
  background-color: white;
  width: 100%;
`;

const HeaderContents = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 20px;
  font-weight: bold;
  margin: 16px;
  padding: 20px 0px;
`;

const Body = styled.div`
  margin: 100px 24px 0px 24px;
  overflow: auto;
  padding-bottom: 80px;
`;

const Chatting = styled.div`
  bottom: 0;
  position: fixed;
  height: 80px;
  background-color: #f1f1f5;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SystemMsg = styled.div`
  font-size: 14px;
  text-align: center;
  color: #787878;
`;

const TextMsg = styled.input`
  font-size: 16px;
  padding: 16px;
  /* height: 54px; */
  width: 310px;
  border: none;
  border-radius: 12px;
`;

const Send = styled.span`
  bottom: 23px;
  right: 33px;
  position: fixed;
`;

const RowBox = styled.div`
  display: flex;
  flex-direction: row;
`;
const TimeBox = styled.span`
  font-size: 14px;
  color: #787878;
  display: flex;
  flex-direction: column-reverse;
  margin: 0px 8px 15px 8px;
`;
const NameBox = styled.div`
  color: #c4c4c4;
  margin: 4px 0px 0px 8px;
`;

const TextBox = styled.div`
  display: flex;
  background-color: #f1f1f5;
  padding: 15px;
  border-radius: 8px;
  margin: 8px 0px 15px 40px;
  max-width: 190px;
`;
const IsMe = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const TextBoxMe = styled.div`
  border: 1px solid #dddddd;
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0px;
  max-width: 200px;
`;

const Space = styled.div`
  height: 79px;
`;
