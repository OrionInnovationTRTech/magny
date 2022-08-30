import './style.css'

import { startLocalCamera, getRemoteCamera } from './camera';

const cameraButton = document.querySelector('#webcamButton') as HTMLButtonElement;

// Start the camera when the button is clicked
cameraButton.addEventListener('click', async () => {
    await startLocalCamera();
    await getRemoteCamera();
})