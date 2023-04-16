const {EventEmitter} = require('events')
module.exports = class Logger 
{
    static logs = new EventEmitter()

    static logEvent(text, language)
    {
        let date = new Date()
        let log = `[LOG] [${date.toLocaleDateString('it')} - ${date.toLocaleTimeString('it')}] (${language}) : ${text}`
        Logger.logs.emit('log', log)
        console.log(log)
    }

}