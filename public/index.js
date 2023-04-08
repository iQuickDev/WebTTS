document.querySelector('#send').onclick = () => {
    const text = document.querySelector('#text').value
    const language = document.querySelector('#lang').value
    const password = document.querySelector('#password').value
    fetch(`${window.location.protocol}//${window.location.host}/play`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({text, language, password})
    }).then(r => r.json()).then(data => logEvent(data.result))
}

const logs = new WebSocket(`ws://${window.location.host}/logs`)
logs.onmessage = (message) => logEvent(message.data)

function logEvent(event) {
    const logs = document.querySelector('#logs')
    logs.textContent = event + '\n' + logs.textContent
}