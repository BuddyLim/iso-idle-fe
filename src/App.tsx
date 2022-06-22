import Home from 'components/Home/index-Home';
import 'styles/reset.css'
import 'styles/App.css'
import useSocket from 'hooks/useSocket';
import { SocketContext } from 'context/contexts';


function App() {
  const { socketState, currentConnections } = useSocket()

  return (
    <SocketContext.Provider value={socketState}>
      <div className="app">
        <Home currentConnections={currentConnections}/>
      </div>
    </SocketContext.Provider>
  );
}

export default App;
