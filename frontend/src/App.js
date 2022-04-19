import axios from 'axios'
import {
  BrowserRouter as
  Router,
  Routes,
  Route
} from "react-router-dom";

import Users from './components/Users'
import UserInfo from './components/UserInfo'
import UserOrders from './components/UserOrders'

import './App.css';

function App() {

  return (
    <div className="App-container">
        <Router>
          <Routes>
            <Route exact path='/' element={<Users/>} />
            <Route exact path='/user/:id' element={<UserInfo/>} />
            <Route exact path='/orders/:id' element={<UserOrders/>} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
