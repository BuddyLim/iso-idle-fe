import Home from 'components/Home/index-Home';
import 'styles/reset.css'
import 'styles/App.css'
import useSocket from 'hooks/useSocket';
import { SocketContext } from 'context/contexts';


function App() {
  const { sessionID, socketState, currentConnections, currentSceneInfo } = useSocket()

  return (
    <SocketContext.Provider value={socketState}>
      <div className="app">
        <Home 
          sessionID={sessionID} 
          currentConnections={currentConnections} 
          currentSceneInfo={currentSceneInfo}
        />
      </div>
    </SocketContext.Provider>
  );
}

export default App;
