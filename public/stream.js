// Add a button to the page
const button = document.querySelector('#voice');
const voiceStatus = document.querySelector('#voice-status')
const password = document.querySelector('#password')
let isTalking = false
let stream
let socket
let audioContext

button.onclick = () =>
{
    if (isTalking)
    {
        closeAll()
        isTalking = !isTalking
        voiceStatus.textContent = "[OFF]"
        return
    }

    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    }).then(handleMicStream).catch(err => console.error(err));

    socket = new WebSocket(`wss://${window.location.host}/voice?password=${password.value}`)
    socket.addEventListener('close', () =>
    {
        closeAll()
        isTalking = false
        voiceStatus.textContent = "[OFF]"
        logEvent('invalid password')
    })
    isTalking = !isTalking
    voiceStatus.textContent = "[ON]"
}

function handleMicStream(streamObj)
{
    if (socket.readyState != socket.OPEN)
        return

    stream = streamObj;
    audioContext = new AudioContext()
    audioContext.audioWorklet.addModule('audio-worklet.js').then(() =>
    {
        // Create an instance of the AudioWorklet processor
        let processor = new AudioWorkletNode(audioContext, 'microphone-processor');

        // Connect the microphone stream to the processor input
        const input = audioContext.createMediaStreamSource(stream);

        input.connect(processor);
        // Listen for messages from the AudioWorklet processor
        processor.port.onmessage = (event) =>
        {
            // Convert the audio data to binary and send it to the server
            const left16 = convertFloat32ToInt16(event.data);

            socket.send(left16);
        }
    })

    // Converts data to BINARY16
    function convertFloat32ToInt16(buffer)
    {

        let l = buffer.length;
        const buf = new Int16Array(l);
        while (l--)
        {
            buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
        }
        return buf.buffer;
    }
}

function closeAll()
{
    const tracks = stream ? stream.getTracks() : null;
    const track = tracks ? tracks[0] : null;

    if (track)
    {
        track.stop();
    }

    if (audioContext)
    {
        audioContext.close().then(() =>
        {
            stream = null;
            audioContext = null;
        });
    }
}    