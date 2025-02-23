import React, { useEffect,useState } from 'react'
import profileImage from '../../images/profile2.avif';
import './profile.css'
import PostDetail from '../postDetails';
import ProfilePic from '../ProfilePic1';

function Profile() {
  const [pic, setPic] = useState([]);
  const [show, setShow] = useState();
  const [posts, setPosts] = useState([]);
  const [changePic, setChangePic] = useState(false);
  const [User, setUser] = useState("");

const defaultPic =
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/99d73356-a5c8-465b-9e77-6f96cbd836ee/defmyc8-7cbff1dd-1506-4bbc-8f24-90201b6ff243.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzk5ZDczMzU2LWE1YzgtNDY1Yi05ZTc3LTZmOTZjYmQ4MzZlZVwvZGVmbXljOC03Y2JmZjFkZC0xNTA2LTRiYmMtOGYyNC05MDIwMWI2ZmYyNDMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0._Lk2s-kgFiK2SRrfHgY7FQ9FamdOv3rqGBJ9o6bB23o";

  useEffect(() => {
    fetch(`/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
      headers: {
        authorization:"Bearer "+localStorage.getItem('jwt')
      }
    }).then(res => res.json()).then((result) => {
      setPic(result.posts);
      setUser(result.user);
      
    }).catch((err)=>{console.log("from fetch mypost:",err)})
  },[])
  // toggle for show
  function toggleDetails(posts){
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setPosts(posts);
    }
  };

  //changew Profile
  const changeprofile = () => {
    if (changePic) {
      setChangePic(false)
    } else {
      setChangePic(true)
    }
  }




  return (
    <div className="profile">
      {/* profile frame */}
      <div className="profile-frame">
        <div className="profile-pic">
          <img src={User.photo?User.photo:defaultPic} alt=""  onClick={()=>{changeprofile()}}/>
        </div>
        {/* profile data */}
        <div className="profile-data">
          <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
          <div className="profile-info">
            <p>{pic ? pic.length : "0 "} Posts</p>
            <p>{ (User.followers?User.followers.length:"0")} followers</p>
            <p>{User.following?User.following.length:"0"} following</p>
          </div>
        </div>
      </div>
      <hr
        style={{
          width: "90%",
          margin: "auto",
          opacity: "0.8",
          margin: "25px auto",
        }}
      />
      {/* gallery */}
      <div className="gallery">
        {pic.map((pic) => {
          return (
            <img
              src={pic.photo}
              className="item"
              onClick={() => {
                toggleDetails(pic);
              }}
            />
          );
        })}
      </div>
      {show && <PostDetail item={posts} toggleDetails={toggleDetails} />}
      {
        changePic&&<ProfilePic changeprofile={changeprofile}/>
      }
    </div>
  );
}

export default Profile
