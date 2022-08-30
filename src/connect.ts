const servers = {
    iceServers : [
        {
            urls: [ 'stun:stun.l.google.com:19302', 
                    'stun:stun1.l.google.com:19302', 
                    'stun:stun2.l.google.com:19302', 
                    'stun:stun3.l.google.com:19302', 
                    'stun:stun4.l.google.com:19302' ]
        }
    ],
    iceCandidatePoolSize: 10
}

export const peerConnection = new RTCPeerConnection(servers);


// Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, getDocs, query, collection, addDoc, updateDoc, deleteDoc } from  'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAXWuMBpXGtNwZ4o9EYQR74Pl_XqW-Xp7Q",
    authDomain: "magny-1035a.firebaseapp.com",
    projectId: "magny-1035a",
    storageBucket: "magny-1035a.appspot.com",
    messagingSenderId: "413650997463",
    appId: "1:413650997463:web:71a21f809062adeb332092",
    measurementId: "G-LT0D4P5QLT"
};
  
const fireApp = initializeApp(firebaseConfig);
const firestore = getFirestore(fireApp);
