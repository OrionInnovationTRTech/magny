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
import { getFirestore, doc, getDoc, getDocs, query, collection, addDoc, updateDoc, deleteDoc, onSnapshot } from  'firebase/firestore'

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


// Initiate call
export async function createOffer() {
    // Database reference 'call' objects
    const callDocs = collection(firestore, 'calls')
    
    // Create a new call object
    const newDoc = await addDoc(callDocs, {})

    // Offer and answer candidates collections
    const offerCandidates = collection(newDoc, 'offerCandidates')
    const answerCandidates = collection(newDoc, 'answerCandidates')

    // Put call ID to offerInput
    const offerInput = document.querySelector('#offerInput') as HTMLInputElement;
    offerInput.value = newDoc.id;

    // Listen for ICE candidates and add them to the offerCandidates collection
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            addDoc(offerCandidates, event.candidate.toJSON())
        }
    }

    // Create an offer and set it as the local description
    const offerDescription = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offerDescription);

    // Create offer SDP to upload to Firestore
    const offerSDP = {
        type: offerDescription.type,
        sdp: offerDescription.sdp
    }

    // Add offer SDP to Firestore
    await updateDoc(newDoc, { offerSDP })


    // Listen for remote SDP and set it as the remote description
    onSnapshot(newDoc, snapshot => {
        const remoteData = snapshot.data()

        // If there is no remote description set and answer is ready
        if (!peerConnection.currentRemoteDescription && remoteData?.answerSDP) {
            // Set remote description
            peerConnection.setRemoteDescription(new RTCSessionDescription(remoteData?.answerSDP))
        }
    })

    // Listen for remote ICE answer candidates
    onSnapshot(answerCandidates, snapshot => {
        // Track changes in the collection
        snapshot.docChanges().forEach(change => {
            // If there is a new candidate, add it to the peerConnection
            if (change.type === 'added') {
                const newCandidate = new RTCIceCandidate(change.doc.data())
                peerConnection.addIceCandidate(newCandidate)
            }
        })
    })
}
