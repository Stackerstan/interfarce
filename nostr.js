function displayNostr() {
    document.getElementById("maincontent").replaceChildren(prepWindow())
    document.getElementById("heading").innerText = "WTF is Nostr?"
    document.getElementById("content").appendChild(renderDoki("f6c6448b1411d0f70dcc858cdfc00af6ee5833fd7be1bbd2a60436b4af59dc9a"))
    //document.getElementById("content").appendChild(renderDoki("cb399f1ec1302f607d683c31a4928bb3ffbf22a68ba3a3a3db96bfc9038db3cb"))
    //document.getElementById("heading").appendChild(spacer())
    //document.getElementById("heading").appendChild(helpButton("58b02c07e1971ad9178293e0c0d39509a715db35ba3a989ed97d25c6f8e9ad07"))

}