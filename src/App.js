
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import confetti from 'canvas-confetti';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Switch from '@mui/material/Switch';
import 'tailwindcss/tailwind.css';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const firebaseConfig = {
  apiKey: "AIzaSyAFRwmutdSXr2XlY_VROUkN0QRna8kbDvc",
  authDomain: "fresh-squeezed-lemons.firebaseapp.com",
  databaseURL:
"https://fresh-squeezed-lemons-default-rtdb.firebaseio.com",
  projectId: "fresh-squeezed-lemons",
  storageBucket: "fresh-squeezed-lemons.appspot.com",
  messagingSenderId: "680668621920",
  appId: "1:680668621920:web:df718ab12a9a62eda4e705",
  measurementId: "G-BWS491WFX8"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const storage = firebase.storage(); // Get a reference to Firebase Storage

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [image, setImage] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null); // New state for error handling

  useEffect(() => {
    const messagesRef = firebase.database().ref('messages');
    messagesRef.on('value', (snapshot) => {
      const messagesData = snapshot.val();
      const messagesArray = [];
      for (let key in messagesData) {
        messagesArray.unshift({ ...messagesData[key], id: key });
      }
      setMessages(messagesArray);
    });

    const authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      setError(null); // Clear any previous errors
    }, (error) => {
      setError(error.message); // Handle authentication errors
    });

    return () => {
      authUnsubscribe();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputValue.trim() !== '' || image) {
      try {
        if (user) {
          await sendMessageToFirebase(inputValue, image);
          setInputValue('');
          setImage(null);
          confetti();
        } else {
          alert('You must be signed in to post messages!');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    } else {
      alert('Please enter a message or select an image to upload!');
    }
  };

  const sendMessageToFirebase = async (message, image) => {
    const timestamp = Date.now();
    const username = generateRandomSeed();
    const avatarColor = darkMode ? 'white' : 'black';
    const avatarUrl = `https://api.dicebear.com/8.x/adventurer/svg?seed=${username}&color=${avatarColor}`;
    let imageUrl = null;

    if (image) {
      const imageRef = storage.ref(`images/${timestamp}_${image.name}`);
      await imageRef.put(image);
      imageUrl = await imageRef.getDownloadURL();
    }

    firebase.database().ref("messages/" + timestamp).set({
      message,
      timestamp: new Date(timestamp).toLocaleString(),
      username,
      avatarUrl,
      imageUrl,
      likes: 0 // Initialize likes count to 0
    }, (error) => {
      if (error) {
        console.error('Error writing message to Firebase:', error);
      } else {
        console.log('Message written successfully to Firebase');
      }
    });
  };

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const toggleSwitchFunction = () => {
    setDarkMode(!darkMode);
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const signInWithGitHub = async () => {
    try {
      const provider = new firebase.auth.GithubAuthProvider();
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const likeMessage = (messageId) => {
    if (user) {
      const messageRef = firebase.database().ref(`messages/${messageId}`);
      messageRef.transaction((message) => {
        if (message) {
          if (!message.likes) {
            message.likes = 1;
          } else {
            message.likes += 1;
          }
        }
        return message;
      });
      confetti();
    } else {
      alert('Please sign in to like messages!');
    }
  };

  const generateRandomSeed = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let seed = '';
    for (let i = 0; i < 10; i++) {
      seed += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return seed;
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
        <div className={`fixed top-0 left-0 w-full z-50 shadow-md px-4 py-2 text-center ${darkMode ? 'bg-gray-900' : 'bg-gray-300'}`}>
          <h1 className="text-xl font-bold mt-1 flex justify-center items-center">
            PyroScript
            <div style={{ width: '10px' }}></div>
            <div className="flex justify-center items-center">
              <Brightness4Icon />
              <Switch checked={darkMode} onChange={toggleSwitchFunction} />
              <Brightness7Icon />
            </div>
          </h1>
          <form id="guestbookForm" className="flex items-center mt-2 relative mx-auto max-w-md" onSubmit={handleSubmit}>
            <input
              type="text"
              id="entry"
              name="entry"
              placeholder="say something nice..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="border-green-900 rounded-md py-2 px-4 mr-2 focus:outline-none focus:border-green-900 flex-grow input-dark-mode"
              style={{ width: '100%', color: 'black' }}
            />
            {user && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="bg-yellow-600 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-pyro focus:outline-none focus:bg-gray-900 confetti-btn cursor-pointer">
                  Image
                </label>
                {image && <img src={URL.createObjectURL(image)} alt="" className="w-10 h-10 object-cover ml-2 rounded-md" />}
              </>
            )}
           <div style={{ width: '10px' }}></div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-pyro focus:outline-none focus:bg-blue-900 confetti-btn">
              Send
            </button>
          </form>
          <div className="flex justify-center mt-2">
            {user ? (
              <button onClick={signOut} className="bg-pink-800 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-pink-700 focus:outline-none focus:bg-pink-700">
                Sign Out
              </button>
            ) : (
              <>
                <button onClick={signInWithGoogle} className="bg-green-800 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-green-700 focus:outline-none focus:bg-green-700">
                  Google
                </button>
                <div style={{ width: '10px' }}></div>
                <button onClick={signInWithGitHub} className="bg-purple-800 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-purple-800 focus:outline-none focus:bg-purple-800">
                  GitHub
                </button>
              </>
            )}
          </div>
        </div>
        <div className={`max-w-md mx-auto px-8 py-12 mt-20 overflow-hidden ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-300'}`}>
          <div id="entriesContainer" style={{ paddingTop: '100px', width: '100%' }}>
            <div className="flex items-center justify-center">
              <img src="https://api.iconify.design/teenyicons:firebase-outline.svg" alt="Firebase Logo" className="w-4 h-auto" />
              <span className="items-center text-base font-bold" id="messageCount" style={{ width: '100%', color: darkMode ? 'white' : 'black' }}>{messages.length}</span>
            </div>
            {messages.map((message) => (
              <div key={message.id} className={`w-full mb-2 ${message.likes ? 'border-red-500' : ''}`}>
                <div className="flex items-center overflow-hidden">
                  <img src={message.avatarUrl} className="w-8 h-8 mr-2 rounded-full" />
                  <p className="entry-text">{message.message}</p>
                  <button onClick={() => likeMessage(message.id)} className="ml-auto text-sm text-gray-500 focus:outline-none hover:text-red-500">
                                        <img src="https://api.iconify.design/teenyicons:firebase-outline.svg?color=%23f23e02" alt="SVG" className="w-4 h-auto" />{message.likes && `(${message.likes})`}
                  </button>
                </div>
                {message.imageUrl && <img src={message.imageUrl} alt="Uploaded" className="w-full mt-2 rounded-md" />}
                <p className="text-sm text-gray-500">{message.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={`fixed bottom-0 left-0 w-full z-50 bg-gray-300 shadow-md px-4 py-2 text-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-300'}`}>
          <div className="text-sm">
            <a href="https://www.buymeacoffee.com/sudoself" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <img src="https://pub-c1de1cb456e74d6bbbee111ba9e6c757.r2.dev/bmc-logo.svg" alt="SVG" className="w-4 h-auto" />
              <span className="ml-1">buy me a coffee</span>
            </a>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;





