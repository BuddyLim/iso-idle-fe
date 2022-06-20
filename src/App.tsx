import Home from 'components/Home/index-Home';
import React, { useEffect } from 'react';
import 'styles/reset.css'
import 'styles/App.css'
import { io } from "socket.io-client";

function App() {
  useEffect(() =>{
    const socket = io(process.env.REACT_APP_WS_BE_URL as string);
    socket.emit("message")
    return () =>{
      socket.close()
    }
  }, [])

  return (
    <div className="app">
      <Home/>
    </div>
  );
}

export default App;
