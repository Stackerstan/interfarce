//todo ignition
const rootSamizdatId = "9e333343184fe3e98b028782f7098cf596f1f46adf546541e7317d9a5f1d5d57"

let samizdatReady = false
function waitForSamizdatReady(callback) {
    var interval = setInterval(function() {
        if (samizdatReady) {
            clearInterval(interval);
            callback();
        }
    }, 200);
}

function displaySamizdat() {
    document.getElementById("maincontent").replaceChildren(prepWindow())
    document.getElementById("heading").innerText = "Samizdatree"// spontaneously organising tree of self-published notes and other stuff
    document.getElementById("heading").appendChild(spacer())
    document.getElementById("heading").appendChild(helpButton("58b02c07e1971ad9178293e0c0d39509a715db35ba3a989ed97d25c6f8e9ad07"))
    document.getElementById("content").replaceChildren(loadingSign())
    waitForSamizdatReady(function () {
        renderSamizdat()
    })
    rewriteURL("samizdat")
}

function spacer() {
    s = document.createElement("span")
    s.innerText = " "
    return s
}

function helpButton(doki) {
    a = document.createElement("a")
    a.onclick = function () {
        saz = dokiObjects.get(doki)
        if (saz !== undefined) {
            document.getElementById("infomodal").classList.add('is-active')
            document.getElementById("modal-heading").innerText = document.getElementById("heading").innerText + " Help"
            md = new showdown.Converter({
                extensions: [...bindings]
            })
            ht = md.makeHtml(saz.CurrentTip)
            mdht = document.createElement("div")
            mdht.innerHTML = ht
            mdht.className = "content"
            document.getElementById("modal-body").replaceChildren(mdht)//
            edit = document.createElement("button")
            edit.className = "button is-link"
            edit.innerText = "Edit this"
            edit.onclick = function () {
                if (!accountIsInIdentityTree(pubKeyMinus2)) {
                    alert("You must be in the Identity Tree to submit edits")
                }
                setURLID("doki_id", doki)
            }
            document.getElementById("modal-body").appendChild(edit)
        }

    }
    btn = document.createElement("i")
    btn.className = "fas fa-question-circle"
    a.appendChild(btn)
    return a
}

function renderSamizdat() {
    box = document.createElement("div")
    box.className = "content"
    document.getElementById("content").replaceChildren(box)
    // if (samizdatObjects.size === 0) {
    //     document.getElementById("details").replaceChildren(newSamizdatForm())
    // }
    samizdatObjects.forEach(function (event) {
        if (event.id === rootSamizdatId) {
            box.appendChild(oneSamizdat(event))
        }
                event.tags.forEach(function (tags) {
                    if (tags[tags.length-1].length === 64) {
                        p = document.getElementById(tags[tags.length-1])
                        if (p !== null) {
                            p.appendChild(oneSamizdat(event))
                        }
                    }
                })
    })
}

function oneSamizdat(event) {
    var ident
    identityObjects.forEach(function (object) {
        if (object.Account === event.pubkey) {
            ident = object
        }
    })
    //todo if we don't have the identity, ask relays for kind0 event from this pubkey
    //console.log(event)
    article = document.createElement("article")
    article.className = "media"
    figure = document.createElement("figure")
    figure.className = "media-left"
    pic = document.createElement("p")
    pic.className = "image is-64x64"
    pic.innerHTML = `<img src="https://bulma.io/images/placeholders/128x128.png">`
    figure.appendChild(pic)
    article.appendChild(figure)
    mcontent = document.createElement("div")
    mcontent.className = "media-content"
    content = document.createElement("div")
    content.className = "content"
    contentNameAndText = document.createElement("p")
    contentName = document.createElement("a")
    contentName.innerText = (((typeof ident === "object") && (ident.Name.length > 0)) ? ident.Name : event.pubkey) + " "
    if (typeof ident === "object") {
        if (ident.UshBy.length > 0) {
            contentName.appendChild(bluecheck())
        }
    }
    contentName.onclick = function () {
        setURLID("profile_id", event.pubkey)
    }
    contentNameAndText.appendChild(contentName)
    //contentText = document.createElement("p")
    md = new showdown.Converter({
        extensions: [...bindings]
    })

    ht = md.makeHtml(event.content)
    mdht = document.createElement("div")
    mdht.innerHTML = ht

    //contentText.innerText = event.content
    contentNameAndText.appendChild(mdht)
    content.appendChild(contentNameAndText)
    mcontent.appendChild(content)
    nav = document.createElement("nav")
    nav.className = "level is-mobile"
    left = document.createElement("div")
    left.className = "level-left"
    reply = document.createElement("a")
    reply.className = "level-item"
    reply.onclick = function () {
        b = document.getElementById( 'replyform' )
        if (b !== null) {b.remove()}
        if (!hasPermanym(pubKeyMinus2)) {
            alert("You should really create a username before commenting here")
        }
        item = document.getElementById(event.id + "reply")//append(newSamizdatForm(event.id, event.content))//appendChild(newSamizdatForm(event.id, event.content))
        item.appendChild(newSamizdatForm(event.id, event.content))
    }
    span = document.createElement("span")
    span.className = "icon is-small"
    icon = document.createElement("i")
    icon.className = "fas fa-reply"
    span.appendChild(icon)
    reply.appendChild(span)
    left.appendChild(reply)
    nav.appendChild(left)
    mcontent.appendChild(nav)
    mcontent.id = event.id
    replydiv = document.createElement("div")
    replydiv.id = event.id + "reply"
    mcontent.appendChild(replydiv)
    article.appendChild(mcontent)
    return article
}

function bluecheck(type) {
    span = document.createElement("span")
    span.className = "icon is-small"
    icon = document.createElement("i")
    icon.className = "fa-solid fa-user-check"
    span.appendChild(icon)
    return span
}

function newSamizdatForm(id, content) {
    form = document.createElement("div")
    form.className = "field"
    form.id = "replyform"
    ta = document.createElement("textarea")
    ta.className = "textarea"
    ta.placeholder = "Type your reply here"
    ta.id = "reply input"
    ta.maxLength = 560
    btn = document.createElement("button")
    btn.className = "button is-link"
    btn.innerText = "Reply"
    btn.onclick = function () {
        broadcast( document.getElementById( 'reply input' ).value, id)
    }
    btnc = document.createElement("button")
    btnc.className = "button is-link is-light"
    btnc.innerText = "Cancel"
    btnc.onclick = function () {
       b = document.getElementById( 'replyform' )
        b.remove()
    }
    form.appendChild(ta)
    form.appendChild(btn)
    form.appendChild(btnc)

    return form
}

function broadcast(content, id) {
    etags = []
    if (id !== undefined) {
        if (id.length === 64) {
            etags.push(rootSamizdatId)
            if (id !== rootSamizdatId) {
                etags.push(id)
            }

        }
    }
    et = makeEvent(content, etags, 1)
    signHash(et.id).then(function (result) {
        et.sig = result
        sendIt(et)
        console.log(et)
        location.reload()
    })
}