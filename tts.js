const { exec } = require('child_process')
const { randomUUID } = require('crypto')

module.exports = class TTS {    
    static play(text, language)
    {
        let tmpFile = '/tmp/' + randomUUID() + '.wav'
        exec(`pico2wave -l "${language}" -w ${tmpFile} "${text}" && aplay ${tmpFile} && rm ${tmpFile}`)
    }
}
