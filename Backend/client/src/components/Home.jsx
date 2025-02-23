import React,{useEffect,useState} from 'react'
import profileImage from '../images/profile.avif';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { IoCloseSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState();
  let limit = 2;
  let skip = 0;

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/signup");
    }
    fetchPosts();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [])
  
  

  const handleScroll = () => {
    if (document.documentElement.clientHeight + window.pageYOffset >= document.documentElement.scrollHeight)
    {
      skip = skip + 2;
    fetchPosts();


      
    }
  }
  
  const fetchPosts = () => {
    //fetching all post from database
    fetch(`/allposts?limit=${limit}&skip=${skip}`, {
      headers: {
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((posts) => {
        console.log(posts)
        setData((data)=>[...data,...posts]);
      
        
      })
      .catch((err) => {
        console.log("error from feching all posts", err);
      });
  };
  

  //for like btn
  const likePost = (id) => {
    fetch('/like', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization:"Bearer "+ localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        postId:id
      })
    }).then(res => res.json()).then((result) => {
      const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        })
        setData(newData);
    })
      .catch((err) => {
      console.log("error in like post :",err)
    })
  }
  //unlike
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        })
        setData(newData);
      }).catch((err) => {
        console.log("Error in unlike:",err)
      })
  };

  //save comment in server
  const makeComment = (text,id) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
        text:text
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setComment("");
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        
      })
      .catch((err) => {
        console.log("Error in saving comments:", err);
      });
    
  }
  //toggle comments
  const toggleComment = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setItem(posts);
      
    }
  };




  return (
    <div className="home">
      {data.map((post) => {
        const like = post.likes.length;
        return (
          <div className="card">
            {/* {card header} */}
            <div className="card-header">
              <div className="card-pic">
                <img src={profileImage} alt="profile image" width={160} />
              </div>
              <Link to={`/profile/${post.postedBy._id}`}>
                <h5>{post.postedBy.name}</h5>
              </Link>
            </div>

            {/* card image */}
            <div className="card-image">
              <img src={post.photo} alt="" width={160} />
            </div>
            {/* card content */}
            <div className="card-content">
              {post.likes.includes(
                JSON.parse(localStorage.getItem("user"))._id
              ) ? (
                <span
                  className="material-symbols-outlined material-symbols-outlined-red"
                  onClick={() => {
                    unlikePost(post._id);
                  }}
                >
                  favorite
                </span>
              ) : (
                <span
                  className="material-symbols-outlined"
                  onClick={() => {
                    likePost(post._id);
                  }}
                >
                  favorite
                </span>
              )}

              <p>
                {post.likes.length == 0 ? "" : post.likes.length + " Likes"}
              </p>
              <p>{post.body}</p>
              <p
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => {
                  toggleComment(post);
                }}
              >
                View all comments...
              </p>
            </div>
            {/* add comment */}
            <div className="add-comment">
              <span class="material-symbols-outlined">mood</span>
              <br />
              <input
                type="text"
                name="comment"
                id="comment"
                placeholder="Add a comment"
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />

              <button
                className="post"
                onClick={() => {
                  makeComment(comment, post._id);
                }}
              >
                Post
              </button>
            </div>
          </div>
        );
      })}
      {/* //show comment */}
      {show && (
        <div className="showComment">
          <div className="container">
            <div className="postPic">
              <img src={item.photo} alt="" width={60} />
              <div className="details">
                {/* card header */}
                <div
                  className="card-header"
                  style={{ borderBottom: "1px solid #00000029" }}
                >
                  <div className="card-pic">
                    <img src={profileImage} alt="profile image" width={160} />
                  </div>
                  <h5>{ item.postedBy.name}</h5>
                </div>
                {/* comment section */}
                <div
                  className="comment-section"
                  style={{ borderBottom: "1px solid #00000029" }}
                >
                  {item.comments.map((comments) => {
                    return (
                      <p className="comm">
                        <p className="commenter" style={{ fontWeight: "bold" }}>
                          {comments.postedBy.name}
                        </p>
                        <p className="commentText">{comments.comment}</p>
                      </p>
                    );
                  })}

                  <div className="card-content">
                    <p>{item.likes.length} likes</p>
                    <p>{item.body}</p>
                  </div>
                  {/* add comment header */}
                  <div className="add-comment">
                    <span class="material-symbols-outlined">mood</span>
                    <br />
                    <input
                      type="text"
                      name="comment"
                      id="comment"
                      placeholder="Add a comment"
                      onChange={(e) => {
                        setComment(e.target.value);
                      }}
                    />

                    <button
                    className="post"
                    onClick={() => {
                      makeComment(comment, item._id);
                      toggleComment(item)

                    }}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="close-comment" onClick={() => { toggleComment() }}>
            <IoCloseSharp class="material-symbols-outlined-comment material-symbols-outlined"/>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default Home
