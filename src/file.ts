import { peerConnection } from "./connect";
import { dragAndDrop } from "./drag";

export let fileChannel: RTCDataChannel;

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

    fileChannel.onmessage = event => {
        console.log("File received: ", event.data);
    }
}
