import './style.css'

import { startLocalCamera, getRemoteCamera } from './connect';


const cameraButton = document.querySelector('#webcamButton') as HTMLButtonElement;

cameraButton.addEventListener('click', async () => {
    await startLocalCamera();
    await getRemoteCamera();
})