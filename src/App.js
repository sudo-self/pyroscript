import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/auth'; // Import auth from Firebase
import confetti from 'canvas-confetti';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Switch from '@mui/material/Switch';
import 'tailwindcss/tailwind.css';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Initialize Firebase with your Firebase configuration
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

// Main App component
export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const messagesRef = firebase.database().ref('messages');
    messagesRef.on('value', (snapshot) => {
      const messagesData = snapshot.val();
      const messagesArray = [];
      for (let key in messagesData) {
        messagesArray.unshift(messagesData[key]);
      }
      setMessages(messagesArray);
    });

    //listener to track authentication
    const authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    //Unsubscribe
    return () => {
      authUnsubscribe();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputValue.trim() !== '') {
      try {
        if (user) {
          sendMessageToFirebase(inputValue);
          setInputValue('');
          confetti();
        } else {
          alert('Thank you for using Pyroscript Messenger. Sign in is required to post messages.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const sendMessageToFirebase = (message) => {
    const timestamp = Date.now();
    const username = generateRandomSeed();
    const avatarColor = darkMode ? 'white' : 'black'; // Use darkMode state
    const avatarUrl = `https://api.dicebear.com/8.x/adventurer/svg?seed=${username}&color=${avatarColor}`;
    firebase.database().ref("messages/" + timestamp).set({
      message,
      timestamp: new Date(timestamp).toLocaleString(),
      username,
      avatarUrl
    }, (error) => {
      if (error) {
        console.error('Error writing message to Firebase:', error);
      } else {
        console.log('Message written successfully to Firebase');
      }
    });
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

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error('Error signing out:', error);
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
    <script async defer src="https://buttons.github.io/buttons.js"></script> 
          <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="fixed top-0 left-0 w-full z-50 bg-gray-300 shadow-md px-4 py-2 text-center">
          <h1 className="text-xl font-bold mt-1 flex justify-center items-center">
            <script async defer src="https://buttons.github.io/buttons.js"></script>
          <a class="github-button" href="https://github.com/sudo-self/pyroscript" data-color-scheme="no-preference: dark_high_contrast; light: dark_high_contrast; dark: dark_high_contrast;" data-icon="octicon-star" data-size="large" aria-label="Star sudo-self/pyroscript on GitHub">Star</a>
          </h1>
      
          <div className="flex items-center justify-center">
            <Brightness7Icon /> {/* Always show the light mode icon */}
            <span className="items-center text-base font-bold text-gray-900" id="messageCount">{messages.length}</span>
            <Switch checked={darkMode} onChange={toggleSwitchFunction} />
          </div>
    <form id="guestbookForm" className="flex items-center mt-2 relative mx-auto max-w-md" onSubmit={handleSubmit}>
  <input
    type="text"
    id="entry"
    name="entry"
    placeholder="say something nice.."
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    className="border-gray-300 rounded-md py-2 px-4 mr-2 focus:outline-none focus:border-green-900 flex-grow input-dark-mode"
    style={{ width: '100%', color: 'black' }}
  />
  <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-pyro focus:outline-none focus:bg-gray-900 confetti-btn mr-2">
    send
  </button>
  {user ? (
    <button onClick={signOut} className="bg-green-800 text-white px-4 py-2 rounded-md ml-2 transition duration-300 hover:bg-green-700 focus:outline-none focus:bg-green-700">
      SignOut
    </button>
  ) : (
    <button onClick={signInWithGoogle} className="bg-green-800 text-white px-4 py-2 rounded-md ml-2 transition duration-300 hover:bg-green-700 focus:outline-none focus:bg-green-700">
      SignIn
    </button>
  )}
</form>

        </div>
        <div className="max-w-md mx-auto px-8 py-12 mt-20 overflow-hidden">
          <div id="entriesContainer" style={{ paddingTop: '100px' }}>
            {messages.map((message, index) => (
              <div key={index} className="w-full mb-2">
                <div className="flex items-center overflow-hidden">
                  <img src={message.avatarUrl} className="w-8 h-8 mr-2 rounded-full" />
                  <p className="entry-text">{message.message}</p>
                </div>
                <p className="text-sm text-gray-500">{message.timestamp}</p> {/* Date time text with custom styles */}
              </div>
            ))}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 w-full z-50 bg-gray-300 shadow-md px-4 py-2 text-center">
          <div className="text-sm text-gray-600">
            <a href="https://www.buymeacoffee.com/sudoself" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <img src="https://pub-c1de1cb456e74d6bbbee111ba9e6c757.r2.dev/bmc-logo.svg" alt="Jesse's SVG" className="w-4 h-auto" />
              <span className="ml-1">buy me a coffee</span>
            </a>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}


