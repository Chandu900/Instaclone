import React,{useContext} from 'react'
import logo from '../../images/instaLogo.png'
import '../navbar/NabBar.css'
import { Link } from 'react-router-dom';
import { LoginContext } from '../../context/loginContext';

function NabBar({ login }) {
  const { setModalOpen } = useContext(LoginContext)
  

  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (token || login) {
      return (
        <>
          <Link key={"a1"} to="/">
            <li>Home</li>
          </Link>
          <Link key={"a14"} to="/profile">
            <li>Profile</li>
          </Link>
          <Link key={"a13"} to="/myfollowingpost">
            <li>My Following</li>
          </Link>
          <Link key={"a2"} to="/createPost">
            <li>Create Post</li>
          </Link>
          {login && (
            <Link key={"a2"} to="">
              <button
                className="primaryBtn"
                onClick={() => {
                  setModalOpen(true);
                }}
              >
                Log Out
              </button>
            </Link>
          )}
        </>
      );
    } else {
      return <>
        <Link key={"b1"} to="/signup">
          <li>SignUp</li>
        </Link>
        <Link key={"b2"} to="/signin">
          <li>SignIn</li>
        </Link>
      </>;
      
    }
  }
  
  return (
    <div className="navbar">
      <img src={logo} alt="instaLogo" />
      <ul className="nav-menu">
        {loginStatus()}
        
      </ul>
    </div>
  );
}

export default NabBar
