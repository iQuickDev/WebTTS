const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const Logger = require('./logger.js')
const { play } = require('./tts.js')
const Speaker = require('speaker-arm64')
dotenv.config()
const fastify = require('fastify')({
    http2: true,
    https: {
        allowHTTP1: true, // fallback support for HTTP1
        key: fs.readFileSync(path.join(__dirname, "TLS", "fastify.key")),
        cert: fs.readFileSync(path.join(__dirname, "TLS", "fastify.cert")),
      },
})

const speaker = new Speaker({
    channels: 1,         
    bitDepth: 16,         
    sampleRate: 48000     
});

fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
})

fastify.register(require('@fastify/websocket'))

fastify.register(async function (fastify) {
  fastify.get('/logs', { websocket: true }, (connection, req) => {
    Logger.logs.on('log', (log) =>
    {
        connection.socket.send(log)
    })
  })
})

fastify.register(async function (fastify) {
    fastify.get('/voice', { websocket: true }, (connection, req) => {
        if (authorize(req.query.password) || isPrivateIP(req.ip))
        {
            connection.socket.on('message', data => {
                speaker.write(data)
            })
        } else connection.socket.close(1)
    })
})

fastify.post('/play', async (request, reply) =>
{
    const { text, language, password } = await request.body
    if (text)
    {
        if (authorize(password) || isPrivateIP(request.ip)) {
            play(text, language ?? 'en-US')
            Logger.logEvent(text, language)
            reply.code(200).send({result: 'text played correctly'})
        }
        else reply.send({result: 'invalid password'}).code(403)
    } else reply.send({result: 'no text was provided'}).code(400)
})

fastify.listen({ host: '0.0.0.0', port: process.env.SERVER_PORT ?? 50872 }, (err) =>
{
    if (err)
    {
        console.error(err)
        process.exit(1)
    }
    console.log(`WebTTS is ready on port ${process.env.SERVER_PORT ?? 50872}`)
})

function authorize(password) {
    return password == process.env.AUTH_PASSWORD
}

function isPrivateIP(ip) {
    if (process.env.BYPASS_AUTH_LOCAL != "true")
        return false
    const parts = ip.split('.')
    return parts[0] === '10' || 
       (parts[0] === '172' && (parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31)) || 
       (parts[0] === '192' && parts[1] === '168') ||
       (parts[0] === '127')
 }