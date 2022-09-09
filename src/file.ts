import { peerConnection } from "./connect";

export let fileChannel: RTCDataChannel;

export async function createFileChannel() {
    console.log("Creating file channel");
    fileChannel = peerConnection.createDataChannel("fileChannel");

    fileChannel.binaryType = "arraybuffer";
    fileChannel.onbufferedamountlow = null;

    fileChannel.onopen = () => {
        console.log("File channel opened");
    }

    fileChannel.onmessage = (event) => {
        console.log("File received: ", event.data);
    }
}

export async function answerFileChannel() {
    peerConnection.ondatachannel = event => {
        const fileChannel = event.channel;

        fileChannel.binaryType = "arraybuffer";
        fileChannel.onbufferedamountlow = null;

        if (fileChannel.label === "fileChannel") {
            console.log("File channel opened");

            fileChannel.onmessage = event => {
                console.log("File received: ", event.data);
            }
        }
    }
}
