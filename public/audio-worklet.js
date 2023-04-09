class MicrophoneProcessor extends AudioWorkletProcessor
{
    process(inputs, outputs, parameters)
    {
        const input = inputs[0];
        const output = outputs[0];
        const inputChannel = input[0];
        const outputChannel = output[0];

        // Create a new Float32Array with the same length as the input channel
        const inputFloat32Array = new Float32Array(inputChannel.length);

        // Copy the values from the input channel to the Float32Array
        inputFloat32Array.set(inputChannel);

        // Copy the Float32Array to the output channel
        outputChannel.set(inputFloat32Array);

        // Post the Float32Array to the audio worker
        this.port.postMessage(inputFloat32Array);

        return true;
    }
}

registerProcessor('microphone-processor', MicrophoneProcessor);