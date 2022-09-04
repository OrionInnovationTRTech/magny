import './style.css'

import { startLocalCamera, getRemoteCamera } from './camera';
import { createOffer, answerCall } from './connect';

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
    await createOffer();
})

// Answering call //
const offerInput = document.querySelector('#offerInput') as HTMLInputElement;
const answerButton = document.querySelector('#answerButton') as HTMLButtonElement;

// Answer the call if offerID is provided
answerButton.addEventListener('click', async () => {
    if (offerInput.value) {
        await answerCall(offerInput.value);
    }
})