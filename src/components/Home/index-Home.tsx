import React, { useContext } from 'react'
import { HomeComponent } from 'types/Home.type'
import 'styles/Home.css'
import { SocketContext } from 'context/contexts'
import { ClientToServerEvents, ServerToClientEvents } from 'types/Socket.type';
import { Socket } from 'socket.io-client';

export const Home = ({ currentConnections }: HomeComponent) => {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined = useContext(SocketContext)

  const HomeOnlineList = ({ currentConnections }: { currentConnections: Array<string> }) =>{
    const filteredConnections = currentConnections.filter(socketID => socketID !== socket?.id)

    return (
      <div className='home__online-list'>
        Currently Online:
        <div className='home__online-item'>
          {filteredConnections.map(socketID =>{
            return (<div key={socketID}>{socketID}</div>)
          })}
        </div>
      </div>
    )
  }

  return (
    <div className='home'>
      <div>ID: {socket?.id}</div>
      <HomeOnlineList currentConnections={currentConnections}/>
    </div>
  )
}

export default Home
