import { sendFile } from "./file";

const dropArea = document.querySelector('#dropArea') as HTMLDivElement;
const chooseFile = document.querySelector('#chooseFile') as HTMLInputElement;
const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
const sendButton = document.querySelector('#sendFile') as HTMLButtonElement;

export let file : File;

export function dragAndDrop() {
    // Prevent all defaults
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, preventDefaults, false)
    })

    // Highligh when dragged over
    ;['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false)
    })

    // Remove highlight when dragged out
    ;['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unHighlight, false)
    })

    // Handle drop
    dropArea.addEventListener('drop', handleDrop, false)

    // Handle select
    chooseFile.addEventListener('click', handleSelect, false)

    // Handle input
    fileInput.addEventListener('change', handleInput, false)

    // Handle send
    sendButton.addEventListener('click', handleSend, false)
}

export function handleDrop(event: DragEvent) {
    const data = event.dataTransfer
    const files = data?.files

    storeFile(files!);
}

export function handleSelect() {
    fileInput.click();
}

export function handleInput() {
    const files = fileInput.files;

    storeFile(files!);
}

export async function handleSend() {
    console.log("Sending file: ", file);

    sendFile(file);
}

export function storeFile(files: FileList) {
    // Assign file to global variable
    file = files[0];
    console.log(file);

    const fileName = document.querySelector('#fileName') as HTMLParagraphElement;
    fileName.innerText = file.name;

    // Enable send button
    sendButton.disabled = false;
}

export function preventDefaults(e: Event) {
    e.preventDefault()
    e.stopPropagation()
}

export function highlight() {
    dropArea.classList.add('highlight')
}

export function unHighlight() {
    dropArea.classList.remove('highlight')
}