import './style.css'

import { startLocalCamera, getRemoteCamera } from './camera';
import { createOffer, answerCall, resetConnection } from './connect';
import { answerTextChannel, createTextChannel } from './text';
import { dragAndDrop } from './drag';

const cameraButton = document.querySelector('#webcamButton') as HTMLButtonElement;
dragAndDrop()

// Start the camera when the button is clicked
cameraButton.addEventListener('click', async () => {
    await startLocalCamera();
    await getRemoteCamera();
})

// Creating offer //
const callButton = document.querySelector('#callButton') as HTMLButtonElement;

// start the call when offer is created
callButton.addEventListener('click', async () => {
    await createTextChannel();

    await createOffer();
})

// Answering call //
const offerInput = document.querySelector('#offerInput') as HTMLInputElement;
const answerButton = document.querySelector('#answerButton') as HTMLButtonElement;

// Answer the call if offerID is provided
answerButton.addEventListener('click', async () => {
    if (offerInput.value) {
        await answerTextChannel();

        await answerCall(offerInput.value);
    }
})

// Hang up //
export function hangUp() {
    resetConnection();

    // Disable chat controls
    const messageInput = document.querySelector("#messageInput") as HTMLInputElement;
    const sendMessage = document.querySelector("#sendMessage") as HTMLButtonElement;

    messageInput.disabled = true;
    sendMessage.disabled = true;

    // Clear chat
    const chatBox = document.querySelector('#chat-box');
    chatBox!.innerHTML = '';

    // Clear offer input
    offerInput.value = '';

    // Disable buttons
    callButton.disabled = true;
    answerButton.disabled = true;

    // Enable camera button
    cameraButton.disabled = false;

    // Clear video elements
    const localVideo = document.querySelector('#localVideo') as HTMLVideoElement;
    const remoteVideo = document.querySelector('#remoteVideo') as HTMLVideoElement;
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;

    // Disable the hang up button
    hangUpButton.disabled = true;
}

const hangUpButton = document.querySelector('#hangUpButton') as HTMLButtonElement;

hangUpButton.addEventListener('click', hangUp)