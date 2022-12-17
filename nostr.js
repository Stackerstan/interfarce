function displayNostr() {
    waitForDokiReady(function () {
        document.getElementById("maincontent").replaceChildren(prepWindow())
        document.getElementById("heading").innerText = "WTF is Nostr?"
        document.getElementById("content").appendChild(renderDoki("f6c6448b1411d0f70dcc858cdfc00af6ee5833fd7be1bbd2a60436b4af59dc9a"))
        rewriteURL("nostr")
    })
}