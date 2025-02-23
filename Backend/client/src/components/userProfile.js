import React, { useEffect,useState } from 'react'
import profileImage from '../images/profile.avif';
import './navbar/profile.css'
import PostDetail from './postDetails';
import { useParams } from 'react-router-dom';


function UserProfile() {
  const [user, setUser] = useState([]);
  const [isFollow, setIsFollow] = useState();
    const [posts, setPosts] = useState([]);
    const { userId } = useParams()
    
  useEffect(() => {
    fetch(`/user/${userId}`, {
      headers: {
        authorization:"Bearer "+localStorage.getItem('jwt')
      }
    }).then(res => res.json()).then((result) => {
        console.log(result)
        setUser(result.user);
        setPosts(result.posts)
        if (result.user.followUsers.includes(JSON.parse(localStorage.getItem('user'))._id)) {
            setIsFollow(true)
        }

      
    }).catch((err)=>{console.log("from fetch mypost:",err)})
  }, [])
    
  // toggle for show
//   function toggleDetails(posts){
//     if (show) {
//       setShow(false);
//     } else {
//       setShow(true);
//       setPosts(posts);
//     }
//   };

    const followUser = (userId) => {
        fetch("/follow", {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
            followId:userId
          }),
        }).then(res => res.json()).then((data) =>
        {
            setIsFollow(true)
            console.log(data)
        })
    }

    //unfollow
    const unfollowUser = (userId) => {
      fetch("/unfollow", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          followId: userId,
        }),
      })
          .then((res) => { return res.json() })
          .then((data) => {
            setIsFollow(false)
          console.log(data);
        });
    };



  return (
    <div className="profile">
      {/* profile frame */}
      <div className="profile-frame">
        <div className="profile-pic">
          <img src={profileImage} alt="" />
        </div>
        {/* profile data */}
        <div className="profile-data">
          <div className="follow-btn">
                      <h1 style={{display:"inline-block"}}>{user.userName}</h1>
                      <button className='followBtn' onClick={() => {
                          if (isFollow) {
                          unfollowUser(user._id);
                          } else {
                              followUser(user._id);
                          }
                      }} style={{ background: isFollow&&"black"}}>
                          {isFollow ? "Unfollow" : "Follow"}</button>
          </div>
          <div className="profile-info">
            <p>{posts.length} posts</p>
            <p>{user.followers?user.followers.length:"0"} followers</p>
            <p>40 following</p>
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
        {posts.map((post) => {
          return (
            <img
              src={post.photo}
              //   className="item"
              //   onClick={() => {
              //     toggleDetails(pic);
              //   }}
            />
          );
        })}
      </div>
      {/* {show && <PostDetail item={posts} />} */}
    </div>
  );
}

export default UserProfile
