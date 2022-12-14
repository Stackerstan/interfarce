function renderHome() {
    waitForDokiReady(function () {
        document.getElementById("maincontent").replaceChildren(prepWindow())
        document.getElementById("details").appendChild(renderDoki("9827d8ede1572958ef01b67aee20618be038af2976b9aee0b175c3624e93b997"))
        document.getElementById("content").appendChild(renderDoki("cb399f1ec1302f607d683c31a4928bb3ffbf22a68ba3a3a3db96bfc9038db3cb"))
        rewriteURL("home")
    })
}

function renderDoki(doki) {
    dok = document.createElement("div")
    dok.className = "content"
        saz = dokiObjects.get(doki)
        if (saz !== undefined) {
            md = new showdown.Converter({
                extensions: [...bindings]
            })
            ht = md.makeHtml(saz.CurrentTip)
            mdht = document.createElement("div")
            mdht.innerHTML = ht
            mdht.className = "content"
            edit = document.createElement("button")
            edit.className = "button is-link"
            edit.innerText = "Edit this"
            edit.onclick = function () {
                setURLID("doki_id", doki)
            }
            dok.appendChild(mdht)
            dok.appendChild(edit)
        }
    return dok
}

function renderGettingStarted() {
    waitForDokiReady(function () {
        document.getElementById("maincontent").replaceChildren(prepWindow())
        //document.getElementById("details").appendChild(renderDoki("d8ae3a165588c1ed50057328535b41f656eb8645fb65a7760adbc6072ac6ce00"))
        document.getElementById("content").appendChild(renderDoki("d8ae3a165588c1ed50057328535b41f656eb8645fb65a7760adbc6072ac6ce00"))
        rewriteURL("getting-started")
    })
}