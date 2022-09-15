import { fileChannel } from "./file";

const dropArea = document.querySelector('#dropArea') as HTMLDivElement;
const chooseFile = document.querySelector('#chooseFile') as HTMLInputElement;
const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
const sendFile = document.querySelector('#sendFile') as HTMLButtonElement;

export let file : File;

export function dragAndDrop() {
    // Prevent all defaults
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, preventDefaults, false)
    })

    // Highligh when dragged over
    ;['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.add('highlight')
        })
    })

    // Remove highlight when dragged out
    ;['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.remove('highlight')
        })
    })

    // Handle drop
    dropArea.addEventListener('drop', handleDrop, false)

    // Handle select
    chooseFile.addEventListener('click', handleSelect, false)

    // Handle input
    fileInput.addEventListener('change', handleInput, false)

    // Handle send
    sendFile.addEventListener('click', handleSend, false)
}

function handleDrop(event: DragEvent) {
    const data = event.dataTransfer
    const files = data?.files

    storeFile(files!);
}

function handleSelect() {
    fileInput.click();
}

function handleInput() {
    const files = fileInput.files;

    storeFile(files!);
}

async function handleSend() {
    console.log("Sending file: ", file);

    fileChannel.send(file.name);
}

function storeFile(files: FileList) {
    // Assign file to global variable
    file = files[0];
    console.log(file);

    const fileName = document.querySelector('#fileName') as HTMLParagraphElement;
    fileName.innerText = file.name;

    // Enable send button
    sendFile.disabled = false;
}

function preventDefaults(e: Event) {
    e.preventDefault()
    e.stopPropagation()
}