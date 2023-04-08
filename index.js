const fastify = require('fastify')()
const path = require('path')
const dotenv = require('dotenv')
const Logger = require('./logger.js')
const { play } = require('./tts.js')
dotenv.config()

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

fastify.post('/play', async (request, reply) =>
{
    const { text, language, password } = await request.body
    if (text)
    {
        if (authorize(password)) {
            play(text, language ?? 'en-US')
            Logger.logEvent(text, language)
            reply.code(200).send({result: 'text played correctly'})
        }
        else reply.send({result: 'invalid password'}).code(403)
    } else reply.send({result: 'no text was provided'}).code(400)
})

fastify.listen({ host: '0.0.0.0', port: 50872 }, (err) =>
{
    if (err)
    {
        console.error(err)
        process.exit(1)
    }
})

function authorize(password) {
    return password == process.env.AUTH_PASSWORD
}