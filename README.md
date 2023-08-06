# WebTTS
Remote Text-To-Speech and voice transmission solution with authentication

## Setup
```
git clone https://github.com/iQuickDev/WebTTS.git
cd WebTTS
npm install
mkcert -install -cert-file ./TLS/fastify.cert -key-file ./TLS/fastify.key <server ip address>
node .
```

### Installing the external dependencies
WebTTS requires the binary `pico2wave` to be installed and on PATH

#### Debian based
```bash
sudo apt install libttspico-utils
```
#### Arch based (on AUR)
```bash
paru -S svox-pico-bin
```

### Editing the server password and settings
- rename the `.env.example` file to `.env`
- modify the `AUTH_PASSWORD` field to your liking
- modify the `BYPASS_AUTH_LOCAL` field to either `true` or `false` (this setting allows passwordless commands from within your local network)
- modify the `SERVER_PORT` field to change the server's port

once you've done the setup your server will open on port `50872` (if not modified) and will serve content over the HTTPS protocol.

## API

### Text-To-Speech
to trigger a Text-To-Speech action send a `POST` request to
```
https://<address>:50872/play
```
the request payload should look like this
```json
{
    "text": "example text",
    "language": "en-US",
    "password": "yourpasswordhere"
}
```

### Voice
to trigger a Voice action a `WebSocket` needs to be opened like this
```
wss://<address>:50872/voice?password=yourpasswordhere
```
The audio data needs to be encoded in a `16 bit binary array` on `1` channel, a bit depth of `16` and a sample rate of `48000 Hz`
