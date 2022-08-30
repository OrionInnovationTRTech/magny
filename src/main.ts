import './style.css'

import { startLocalCamera, getRemoteCamera } from './camera';
import { createOffer } from './connect';

const cameraButton = document.querySelector('#webcamButton') as HTMLButtonElement;

// Start the camera when the button is clicked
cameraButton.addEventListener('click', async () => {
    await startLocalCamera();
    await getRemoteCamera();
})

const callButton = document.querySelector('#callButton') as HTMLButtonElement;

// start the call when offer is created
callButton.addEventListener('click', async () => {
    await createOffer();
})