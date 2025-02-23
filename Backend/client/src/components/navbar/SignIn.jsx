import {useState,useContext,} from 'react';
import '../navbar/SignIn.css';
import logo from '../../images/instaLogo.png'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { LoginContext } from '../../context/loginContext';


function SignIn() {

  const { setUserLogin } = useContext(LoginContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const postData = () => {
    //checking email
    if (!emailRegex.test(email)) {
      notifyA("Invalid email");
      return;
    }
    // Sending data to server
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB("Signed In Successfully");
        
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setUserLogin(true)

          // setUserLogin(true);
          navigate("/");
        }
        console.log(data);
      });
  };
  return (
    <div className="signIn">
      <div className="loginForm">
        <img className="signInLogo" src={logo} alt="logo" />
        <div className="form">
          <div>
            <input type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} name="email" id="email" placeholder="Email" />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e)=>{setPassword(e.target.value)}}
              id="password"
              placeholder="Password"
            />
          </div>
          <input onClick={()=>postData()}
            type="submit"
            id="login-btn"
            value="Sign In"
            style={{
              height: "30px",
              backgroundColor: "#1773EA",
              border: "none",
              borderRadius: "2px",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
              padding: "5px 10px",
              boxSizing:"border-box"
            }}
          />
        </div>
      </div>
      <div className="loginForm2">
        Don't have an account ?
        <Link
          to="/signup"
          style={{
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          <span style={{ color: "blue", cursor: "pointer" }}>SignUp</span>
        </Link>
      </div>
    </div>
  );
}

export default SignIn
