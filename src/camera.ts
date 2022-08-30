import { peerConnection } from "./connect";

export async function startLocalCamera() {
    let localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    // Push tracks from localStream to peerConnection
    localStream.getTracks().forEach( track => {
        peerConnection.addTrack(track, localStream);
    })

    // Add stream to local video element
    const localVideo = document.querySelector('#localVideo') as HTMLVideoElement;
    localVideo.srcObject = localStream;
}

export async function getRemoteCamera() {
    let remoteStream = new MediaStream();

    // Get tracks from the peerConnection
    peerConnection.ontrack = event => {
        event.streams[0].getTracks().forEach( track => {
            remoteStream.addTrack(track);
        })
    }

    // Add stream to remote video element
    const remoteVideo = document.querySelector('#remoteVideo') as HTMLVideoElement;
    remoteVideo.srcObject = remoteStream;

    console.log(peerConnection.localDescription);
}