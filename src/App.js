import { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './Firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload'
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [modalStyle] = useState(getModalStyle);

  const classes = useStyles();

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [openSignIn, setOpenSignIn] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user , setUser] = useState(null)

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser){
        // user has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        // User has logged out
        setUser(null)
      }

    })

    return () => {
      // Cleanup
      unsubscribe();
    }
  }, [user, username])



  const handleclose = () => {
    setOpen(false);
  }
  useEffect(()=>{
    db.collection('posts').orderBy('timestamp', 
  'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc =>({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, [])

  const signUp = (e) => {
    e.preventDefault();
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
       return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));
  }
  const signIn = (e) => {
    e.preventDefault();
    auth
    .signInWithEmailAndPassword(email, password)
    .catch((err) => alert(err.message))

    setOpenSignIn(false);
  }
  return (
    <div className="App">
      


      <Modal 
        open={open}
        onClose={()=> setOpen(false)}
                    >
          <div style={modalStyle} className={classes.paper}>
           <form className="app__signUp"> 
                <center>
                  <img className="app__headerImage" src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
                </center>
                  <Input placeholder="email" type="text" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                  <Input placeholder="username" type="text" value={username} onChange={(e)=> setUsername(e.target.value)}/>
                  <Input placeholder="password" type="password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
                  <Button onClick={signUp}>Sign Up</Button>
            </form>
          </div>
    </Modal>


    <Modal 
        open={openSignIn}
        onClose={()=> setOpenSignIn(false)}
                    >
          <div style={modalStyle} className={classes.paper}>
           <form className="app__signUp"> 
                <center>
                  <img className="app__headerImage" src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
                </center>
                  <Input placeholder="email" type="text" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                  <Input placeholder="password" type="password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
                  <Button onClick={signIn}>Sign In</Button>
            </form>
          </div>
    </Modal>
      <div className="app__header">
        <img src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" className="app__headerImage"/>
        {
          user ? (
          <Button onClick={()=>auth.signOut()}>Log out</Button>
          ): (
          <div className="app__loginContainer">
          <Button onClick={()=> setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={()=> setOpen(true)}>Sign up</Button>
          </div>
          )
     }
      </div>
      
      <div className="app__posts">
        <div className="app__postsLeft">  {
        posts.map(({id, post}) => (
          <Post user={user} key={id} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
      }</div>
    <div className="app__postsRight">
        <InstagramEmbed
              url='https://instagr.am/p/Zw9o4/'
              clientAccessToken='123|456'
              maxWidth={320}
              hideCaption={false}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
          />

    </div>
      
      </div>
      {user?.displayName ? (
    <ImageUpload username={user.displayName}/>

      ): (
        <h3>Sorry you need to Login to upload</h3>
      )}
    </div>
  );
}

export default App;
