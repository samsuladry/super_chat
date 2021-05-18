import React, { useState, useRef } from 'react';
import './App.css';

//firebase
import firebase from 'firebase/app'; // firebase SDK (software development kit)
import 'firebase/firestore'; // untuk database
import 'firebase/auth'; // untuk user auhentication

//hooks
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

//tempat nak connect kan front end dengan firebase punya db(firestore)
firebase.initializeApp(
  {
    apiKey: "AIzaSyCJ-HvDXGbqeW_ROQFtaETl5765ir8IbEA",
    authDomain: "superchat-tuto.firebaseapp.com",
    projectId: "superchat-tuto",
    storageBucket: "superchat-tuto.appspot.com",
    messagingSenderId: "503658334268",
    appId: "1:503658334268:web:be239d768414b8bc7a1b39",
    measurementId: "G-LK327HGGK0"
  }
)

const auth = firebase.auth();
const firestore = firebase.firestore();




function App() {

  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header>

      </header>

      <section>
        { user ? <ChatRoom/> : <SignIn/> }
      </section>
    </div>
  );
}


function SignIn()
{
  const signInWithGoogle = ()=>
  {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return( <button onClick = {signInWithGoogle}>Sign in with Google</button>)
}

function SignOut()
{
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign out</button>
  )
}

function ChatRoom()
{
  const dummy = useRef()
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) =>
  {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add(
      {
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
      }
    )

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return(
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} /> )}
      <div ref={dummy}></div>
    </main>

    <form onSubmit={sendMessage}>
      <input type="text" value={formValue}  onChange={(e) => setFormValue(e.target.value)} placeholder="Input your message here..."/>
      <button type='submit' >🕊️</button>
    </form>
    </>
  )
}

function ChatMessage(props)
{
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL}/>
      <p>{text}</p>
    </div>
  )
  
}

export default App;
