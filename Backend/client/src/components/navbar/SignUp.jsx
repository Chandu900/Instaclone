import React, {useState} from 'react'
import logo from '../../images/instaLogo.png'
import '../../components/navbar/SignUp.css';
import { Link ,useNavigate} from 'react-router-dom';
import { toast} from "react-toastify";


function SignUp() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  //nevigate user signIn page
  const nevigate = useNavigate();
  
  
const notify = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);
  //regex for email
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
  const postData = () => {
    //checking email
    if (email) {
      if (!emailRegex.test(email)) {
        notify("Invalid email");
        return;
      } 

    }if (!passRegex.test(password)) {
      notify(" conatin at least one digit ,special character , one capitalcase and lowercase");
      return;
      
    }

    //sending data to server
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        userName: userName,
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          
          notify(data.error)
          console.log(data);
        } else {
          notifyB(data.message);
          nevigate("/signin")
        }
      });
  }


  
  return (
    <div className="SignUp">
      <div className="form-container">
        <img className="signUpLogo" src={logo} alt="logo" />
        <p className="loginPara">
          Sign up to see photos and videos
          <br /> from your freinds
        </p>
        <div className="form">
          <div>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter fullname"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter username"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <p
            className="loginPara"
            style={{ fontSize: "12px", margin: "3px 0px" }}
          >
            By signing up , you agree to out Terms, <br /> privacy policy and
            cookis policy.
          </p>
          <input
            onClick={()=>{postData()}}
            type="submit"
            value="signUp"
            style={{
              height: "30px",
              backgroundColor: "#1773EA",
              border: "none",
              borderRadius: "3px",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
              padding: "5px 10px",
              width: "80%",
            }}
          />
        </div>
      </div>
      <div className="form2">
        Already have an account ?
        <Link to="/signin" style={{ textDecoration: "none" }}>
          <span
            style={{
              color: "blue",
              cursor: "pointer",
            }}
          >
            Sign In
          </span>
        </Link>
      </div>
    </div>
  );
}

export default SignUp
