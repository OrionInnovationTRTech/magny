import { peerConnection } from "./connect";
import { answerFileChannel } from "./file";

// For initiator of the call
export async function createTextChannel() {
    console.log('Creating text channel');
    const textChannel = peerConnection.createDataChannel("textChannel");

    textChannel.onopen = () => {
        openTextChannel(textChannel)
    }

    textChannel.onmessage = (event) => {
        console.log("Message received: ", event.data);
        createBubble(event.data, false);
    }
}

export async function answerDataChannel() {
    peerConnection.ondatachannel = event => {
        console.log(event.channel);

        if (event.channel.label === "textChannel") {
            const textChannel = event.channel;

            openTextChannel(textChannel);

            textChannel.onmessage = event => {
                console.log("Message received: ", event.data);
                createBubble(event.data, false);
            }
        }
        else if (event.channel.label === "fileChannel") {
            answerFileChannel(event.channel);
        }
    }
}

function createBubble(message: string, isOwn: boolean) {
    // Create bubble according to speaker
    const bubble = document.createElement('div');
    bubble.classList.add('talk-bubble');
    bubble.classList.add(isOwn ? 'talk-right' : 'talk-left');

    // Create message
    const text = document.createElement('p')
    text.innerText = message;
    bubble.appendChild(text);

    // Add bubble to chat
    const chatBox = document.querySelector('#chat-box');
    chatBox?.appendChild(bubble);
    
    // Scroll to bottom
    chatBox!.scrollTop = chatBox!.scrollHeight;
}

function openTextChannel(textChannel: RTCDataChannel) {
    console.log("Text channel opened");
        
    const messageInput = document.querySelector("#messageInput") as HTMLInputElement;
    const sendMessage = document.querySelector("#sendMessage") as HTMLButtonElement;

    // Enable chat controls
    messageInput.disabled = false;
    
    messageInput.addEventListener('keyup', () => {
        if (messageInput.value.length > 0) {
            sendMessage.disabled = false;
        }
        else {
            sendMessage.disabled = true;
        }
    })

    function sendMessageHandler() {
        const message = messageInput.value;
        textChannel.send(message);
        createBubble(message, true);
        messageInput.value = "";

        sendMessage.disabled = true;
    }

    const chatForm = document.querySelector('#chatForm') as HTMLFormElement;

    // Send message
    chatForm.addEventListener("submit", (event) => {
        event.preventDefault();
        sendMessageHandler();
    });
}