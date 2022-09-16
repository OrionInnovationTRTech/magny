import './style.css'

import { startLocalCamera, getRemoteCamera } from './camera';
import { createOffer, answerCall, resetConnection } from './connect';
import { answerDataChannel, createTextChannel } from './text';
import { createFileChannel, sendFile } from './file';
import { handleDrop, handleInput, handleSelect, handleSend, highlight, preventDefaults, unHighlight } from './drag';

const cameraButton = document.querySelector('#webcamButton') as HTMLButtonElement;

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
    await createFileChannel();

    await createOffer();
})

// Answering call //
const offerInput = document.querySelector('#offerInput') as HTMLInputElement;
const answerButton = document.querySelector('#answerButton') as HTMLButtonElement;

// Answer the call if offerID is provided
answerButton.addEventListener('click', async () => {
    if (offerInput.value) {
        await answerDataChannel();

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

    // Reset file transfer //
    ////////////////////////
    const dropArea = document.querySelector('#dropArea') as HTMLDivElement;
    const chooseFile = document.querySelector('#chooseFile') as HTMLInputElement;
    const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    const sendButton = document.querySelector('#sendFile') as HTMLButtonElement;
    const fileName = document.querySelector('#fileName') as HTMLParagraphElement;

    // Clear file input
    fileInput.value = '';

    // Clear file name
    fileName.innerText = '';

    // Remove events for default
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.body.removeEventListener(eventName, preventDefaults)
    })

    // Remove highlight
    ;['dragenter', 'dragover'].forEach(eventName => {
        dropArea.removeEventListener(eventName, highlight)
    })

    // Remove highlight out
    ;['dragleave', 'drop'].forEach(eventName => {
        dropArea.removeEventListener(eventName, unHighlight)
    })

    // Remove handle drop
    dropArea.removeEventListener('drop', handleDrop)
    // Remove handle select
    chooseFile.removeEventListener('click', handleSelect)
    // Remove handle input
    fileInput.removeEventListener('change', handleInput)
    // Remove handle send
    sendButton.removeEventListener('click', handleSend)


    // Disable the hang up button
    hangUpButton.disabled = true;
}

const hangUpButton = document.querySelector('#hangUpButton') as HTMLButtonElement;

hangUpButton.addEventListener('click', hangUp)