import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';  // Import the Home component
import Lobby from './pages/Lobby';

const App = () => {
  return (
    <>
    <Router>
    <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/' element={<Lobby />} />
      </Routes>

    </Router>
     
    </>
  );
};

export default App;
