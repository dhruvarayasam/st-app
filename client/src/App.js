import './App.css';
import { Route, Routes } from 'react-router-dom';
import Landing from './components/Landing';
import Navbar from './components/Navbar'
import Login from './components/Login';
import Signup from './components/Signup';
import AccountHome from './components/AccountHome';
import Settings from './components/Settings'
import { UserContextProvider } from './contexts/UserContext';
import { AlpacaAuthStatusProvider } from './contexts/AlpacaAuthStatus';

function App() {
  return (
    <div className="App">

      <UserContextProvider>
        <AlpacaAuthStatusProvider>

          <Routes>

            <Route index element={
              <div>
                <Landing />
              </div>
            } />

            <Route path="/login" element={
              <div>
                <Navbar />
                <Login />
              </div>
            } />

            <Route path="/signup" element={
              <div>
                <Navbar />
                <Signup />
              </div>
            } />
            <Route path="/accounthome" element={

              <div>
                <Navbar />
                <AccountHome />
              </div>

            } />

            <Route path="/settings" element={

              <div>
                <Navbar />
                <Settings />
              </div>

            } />


          </Routes>
        </AlpacaAuthStatusProvider>
      </UserContextProvider>
    </div>
  );
}

export default App;
