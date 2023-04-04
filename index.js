
const fastify = require('fastify')()
const fs = require('fs')
const tts = require('say')
const path = require('path')

fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
})

fastify.post('/play', async (request, reply) =>
{
    const text = await request.body.text
    tts.speak(text)
    reply.code(200).send()
})

const start = async () =>
{
    try
    {
        await fastify.listen({ host: '0.0.0.0', port: 50872 })
    } catch (err)
    {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
