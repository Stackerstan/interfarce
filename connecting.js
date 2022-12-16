

function displayWhileConnecting() {
   let p = "###### Welcome to Stackerstan \n\nYou're seeing this because the frontend is trying to connect to a Mindmachine. If you see this for longer than a few seconds there's something wrong, try refreshing. \n\nIf it still can't connect, the instance you are connecting to has probably crashed (it happens). Places to seek help: [Nostr](https://t.me/nostr_protocol) or [Stackerstan](https://t.me/stackerstan) telegram group, [stackerstan github](https://github.com/stackerstan)"
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
