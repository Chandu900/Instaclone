
import './App.css';
import { useState } from 'react';
import NabBar from './components/navbar/NabBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SignUp from './components/navbar/SignUp';
import SignIn from './components/navbar/SignIn';
import Profile from './components/navbar/Profile';
import { ToastContainer } from 'react-toastify';
import Createpost from './components/Createpost';
// import 'react-toastify/dist/ReactToastify.css'
import { LoginContext } from './context/loginContext';
import Modal from './components/Modal';
import UserProfile from './components/userProfile';
import MyFolliwngPost from './components/MyFollowingPost';

function App() {
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <BrowserRouter>
      <div className="App">
        <LoginContext.Provider value={{ setUserLogin,setModalOpen}}>
          <NabBar login={userLogin} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn  />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route path="/createPost" element={<Createpost />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/myfollowingpost" element={<MyFolliwngPost/>} />
          </Routes>
          <ToastContainer theme="dark" />
          {(modalOpen && <Modal props={{setModalOpen} } />)}
        </LoginContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
