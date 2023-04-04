document.querySelector('#send').onclick = () => {
    const text = document.querySelector('#text').value
    fetch(`${window.location.href}play`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({text})
    }).then(r => r.json()).then(d => console.log(d))
}