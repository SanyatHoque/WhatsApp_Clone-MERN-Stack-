import React, { useEffect,useState } from 'react';
import "./Chat.css";
import { Avatar,IconButton } from "@material-ui/core";
import { AttachFile, MoreVert, SearchOutlined} from "@material-ui/icons";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import io from 'socket.io-client';
import ScrollableFeed from 'react-scrollable-feed'

const CONNECTION_PORT = "http://localhost:8085";   
let socket
function Chat({ messagesList }){
    const [room, setRoom] = useState("");
    const [sender,setSender] = useState("");
    const [sender_room,setSender_room] = useState("");
    const [content,setContent] = useState("");
    const [loggedIn, setloggedIn] = useState(false); 
    // console.log("message",messagesList)
    useEffect(()=> {
        socket = io(CONNECTION_PORT);
        console.log('CONNECTION_PORT');
    },[CONNECTION_PORT]);
    function sendMessage(e) {
        e.preventDefault();
        let reqBody = {
            room: room,
            sender: sender,
            message: content,
            // name:"DEMO APP",
            // timestamp:"Just now !",
            received: false
        }
        fetch(`${CONNECTION_PORT}/api/message`, 
        {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            mode:'cors',
            body: JSON.stringify(reqBody)
        })
            .then((res) => {
                return res.json();})
            .then((resJson) => {
                socket.emit("new-message-front", resJson);})
            .catch((err) => {
                console.log(err);});
        console.log("Sending message TO Backend")
        setContent("");
    }
    const connectToRoom = () => {
        setloggedIn(true);
        setSender_room(sender);
        socket.emit("join_room", room);
      };
    return(
        <div>
        {loggedIn? (
        <div className="chat">
            <div className="chat__header">
                <Avatar />
                <div className="chat__headerInfo">
                    <h3>ChatRoom {room}</h3>
                    <p>Active </p>
                </div>

                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="chat__body">
            <ScrollableFeed>
                {messagesList.map(x => (
                    <p className={x.sender==sender_room? "chat__message":"chat__message chat_receiver"}>
                    <span className="chat__name">{x.sender}</span>
                    {x.message}
                    <span className="chat__timestamp">{x.timestamp}</span>
                    </p>
                ))}
            </ScrollableFeed>
            </div>
            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                <input type="text" placeholder="type your message here" value={content} onChange={(e)=>setContent(e.target.value)} required/>
                    <button onClick={sendMessage} type="submit">Send a message</button>
                </form>
                <MicIcon />
            </div>
        </div>
        ):(
            <div className="logIn">
                <div className="inputs">
                <input type="text" value={sender} placeholder="Name..." onChange={(e) => {setSender(e.target.value);}}/>
                <input type="text" value={room} placeholder="Room..." onChange={(e) => {setRoom(e.target.value);}}/>
            </div>
            <button onClick={connectToRoom}>Enter Chat</button>
        </div>
        )}
        </div>
    );
}

export default Chat;