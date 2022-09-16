import { peerConnection } from "./connect";
import { dragAndDrop } from "./drag";

export let fileChannel: RTCDataChannel;

const MAX_CHUNK_SIZE = 65536;
const END_OF_FILE = "EOF";

export async function createFileChannel() {
    console.log("Creating file channel");
    fileChannel = peerConnection.createDataChannel("fileChannel");

    fileChannel.binaryType = "arraybuffer";
    fileChannel.onbufferedamountlow = null;

    fileChannel.onopen = () => {
        openFileChannel()
    }

}

export async function answerFileChannel(channel: RTCDataChannel) {
    fileChannel = channel;

    fileChannel.binaryType = "arraybuffer";
    fileChannel.onbufferedamountlow = null;

    fileChannel.onopen = () => {
        openFileChannel();
    }
}

function openFileChannel() {
    console.log("File channel opened");

    dragAndDrop()
    const receivedBuffers: any = [];
    let receivedBytes = 0;

    let messageType = 0;

    let fileName : string = "";
    let fileSize : number = 0;

    fileChannel.onmessage = event => {
        // Download file
        const { data } = event;

        try {
            if (messageType === 0) {
                fileName = data;
                console.log("Receiving file: ", fileName);
    
                messageType = 1;
            }
            else if (messageType === 1) {
                fileSize = data;
                console.log("File size: ", fileSize);
    
                messageType = 2;
            }
            else if (messageType === 2) {
                if (data !== END_OF_FILE) {
                    // Add to buffer array
                    receivedBuffers.push(data);
                    receivedBytes += data.byteLength;
    
                    console.log(`Received ${receivedBytes} of ${fileSize} bytes`); 
                }
                else {
                    downloadFile(fileName, receivedBuffers);
                }
            }

        } catch (error) {
            console.log("Error: ", error);
        }

    }
}

export async function sendFile(file: File) {
    // Firstly, send the file name
    fileChannel.send(file.name);

    // Secondly, send the file size
    fileChannel.send((file.size).toString());

    const arrayBuffer = await file.arrayBuffer();

    const MAX_BUFFERED_AMOUNT = fileChannel.bufferedAmountLowThreshold = arrayBuffer.byteLength / 100

    for (let i = 0; i < arrayBuffer.byteLength; i += MAX_CHUNK_SIZE) {
        // Wait for buffer to be low enough
        if (fileChannel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
            await new Promise(resolve => {
                fileChannel.onbufferedamountlow = resolve;
            })
        }

        // Split to chunk
        const chunk = arrayBuffer.slice(i, i + MAX_CHUNK_SIZE);

        // Send chunk
        fileChannel.send(chunk);
        console.log(`Sending chunk ${i} of ${arrayBuffer.byteLength}`);
    }

    // Send EOF
    fileChannel.send(END_OF_FILE);
}

async function downloadFile(fileName: string, receivedBuffers: any) {
    // Create file
    const file = new File(receivedBuffers, fileName);

    // Create download link
    const downloadLink = document.createElement("a");
    downloadLink.download = fileName;

    const URL = window.URL || window.webkitURL;
    downloadLink.href = URL.createObjectURL(file);

    downloadLink.click();
    downloadLink.remove();
}