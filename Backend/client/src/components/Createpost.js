import React,{useState,useEffect} from 'react'
import profileImage from "../images/profile2.avif";
import './createpost.css';
import defaultImage from '../images/default_image.webp';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function Createpost() {
  const [body, setBody] = useState();
  const [image, setImage] = useState();
  const [url, setUrl] = useState();

  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);
  const navigate = useNavigate()
  
  //image preview
  const loadfile = (event) => {
    let output = document.getElementById("target");
    output.src = URL.createObjectURL(event.target.files[0]);

    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };
  // saving post to mongodb

  useEffect(() => {
    if (url) {
      fetch("/createPost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            notifyA(data.error);
          } else {
            notifyB("Successfully Posted");
            
                       
            navigate("/");
          }
        })
        .catch((err) => console.log(err));
    }
  },[url]);


  //posting image at cloudinary
  const postDetails =() => {
    
    const data = new FormData()
    data.append('file', image)
    data.append('upload_preset', "insta_Clone");
    data.append("cloud_name", "chandu021");
    fetch("https://api.cloudinary.com/v1_1/chandu021/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => {
        return res.json()
      })
      .then((result) => {
        setUrl(result.url)
      
      })
      .catch((err) => {
        console.log("cloudinery :",err);
      });

    
       
  }
    
    
  return (
      <div className='createPost'>
          <div className="post-header">
              <h4 style={{ margin: "3px auto" }}>Create new post</h4>
        <button id="post-btn" onClick={() => { postDetails() }}>Share</button>
              
                
          </div>
          {/* main-div */}
          <div className="main-div">
              <img id='target' src={defaultImage} alt='img' />
        <input type="file" accept='image/*' onChange={(event) => { loadfile(event); setImage(event.target.files[0])}}/>
          </div>
          {/* details */}
          <div className="details">
              <div className="card-header">
                  <div className="card-pic">
                      <img src={profileImage} alt="" />
                  </div>
                      <h5>Ramesh</h5>
              </div>
              <textarea value={body} onChange={(e)=>{setBody(e.target.value)}} type="text" name="" id="" placeholder='write a caption....'></textarea>
          </div>
          
      
    </div>
  )
}

export default Createpost
