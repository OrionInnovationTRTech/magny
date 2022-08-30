
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