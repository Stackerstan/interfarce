

function displayWhileConnecting() {
   let p = "###### Welcome to Stackerstan \n\nYou're seeing this because the frontend is trying to fetch Nostr Events from the Mindmachine and relays. It can sometimes be slow, I mean this is pre-alpha level stuff... but if this doesn't disappear after something like 20 seconds there's probably something wrong, try refreshing. \n\nIf the connection indicator at the top-right keeps spinning then the Mindmachine instance you are connecting to has probably crashed and needs to be restarted (it happens a lot). \n\nYou can also go to github and compile the Mindmachine to run it locally (this is how it's intended to be used). \n\nPlaces to seek help: [Nostr](https://t.me/nostr_protocol) or [Stackerstan](https://t.me/stackerstan) telegram group, [stackerstan github](https://github.com/stackerstan)"
    md = new showdown.Converter({
        extensions: [...bindings]
    })
    ht2 = md.makeHtml(p)
    mdht2 = document.createElement("div")
    mdht2.innerHTML = ht2
    mdht2.className = "content"
    box = document.createElement("div")
    box.appendChild(mdht2)
    document.getElementById("connecting").replaceChildren(box)
}
