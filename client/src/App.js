import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import io from 'socket.io-client';

const CONNECTION_PORT = "http://localhost:8085";   
let socket

function App() {
    const [messages, setMessage] = useState("");
    const [messagesList, setMessageList] = useState([]);
    
    useEffect(()=> {
        socket = io(CONNECTION_PORT);
        console.log('CONNECTION_PORT');
    },[CONNECTION_PORT]);
    useEffect(()=> {
        fetch(`${CONNECTION_PORT}/api/message`,{method: "GET"})
        .then((res) => {
            return res.json();})
        .then((resJson) => {
            setMessageList(resJson);})
        .catch((err) => {
            console.log(err);});
        console.log('FETCH ALL MESSAGES FROM MONGO',messagesList)
    },[]);
    useEffect(()=>{
        socket.on("new-message-backend", async (message) => {
            setMessageList([...messagesList,message]);
            // setMessage(message);
        });
        // setMessageList([...messagesList,messages]);
        console.log("add message from backend to messageList", messagesList);
    },[messagesList]);
    // console.log("messages",messages);
    // console.log("messagesList",messagesList)
  return (
    <div className="app">
      <div className="app__body"> 
        <Sidebar />
        <Chat messagesList={messagesList}/>
      </div>
    </div>
  );
}

export default App;
