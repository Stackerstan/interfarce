function displayUshTree() {
    document.getElementById("maincontent").replaceChildren(prepWindow())
    document.getElementById("heading").innerText = "Identity Tree: Cheapest Sybil Attack Mitigation, Ever."
    document.getElementById("heading").appendChild(spacer())
    document.getElementById("heading").appendChild(helpButton("2a60437d8637d0d3f18ded4a5435ae47794c047c2968d0b29903aafc93dc4b66"))
    document.getElementById("details").replaceChildren(unverifiedHeader(), dokiInABubble("6a2205445c6c24f35b353f3662fc8baaa937067ba94cb3d1c854e6aa4a0df516"), getUnverified())
    renderUshTree()
}

function unverifiedHeader() {
    h = document.createElement("h3")
    h.className = "is-3"
    h.innerText = "Accounts waiting to be added"
    return h
}

function renderUshTree() {
    cont = document.getElementById("content")
    identityObjects.forEach(function (ident) {
        if (ident.UshBy.length > 0) {
            parentIdent = document.getElementById(ident.UshBy)
            if (parentIdent !== null) {
                parentIdent.appendChild(getIdentityLayout(ident))
            } else {
                cont.appendChild(getIdentityLayout(ident))
            }
        }
    })
}

function getUnverified() {
    box = document.createElement("div")
    box.className = "content"
    identityObjects.forEach(function (ident) {
        if (ident.UshBy.length === 0) {
            box.appendChild(getIdentityLayout(ident))
        }
    })
    return box
}

function getIdentityLayout(ident) {
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
    mcontent.id = ident.Account
    content = document.createElement("div")
    content.className = "content"
    contentNameAndText = document.createElement("p")
    contentName = document.createElement("a")
    contentName.onclick = function () {
        setURLID("profile_id", ident.Account)
    }
    contentName.innerText = ((ident.Name.length > 0) ? ident.Name : ident.Account) + " "
    if (typeof ident === "object") {
        if (ident.UshBy.length > 0) {
            contentName.appendChild(bluecheck())
        }
    }
    contentNameAndText.appendChild(contentName)
    contentCred = document.createElement("p")
    contentCred.innerText = "Account Number: " + ident.Order.toString()
    contentNameAndText.appendChild(contentCred)
    contentText = document.createElement("p")
    contentText.innerText = ident.About
    contentNameAndText.appendChild(contentText)
    content.appendChild(contentNameAndText)
    mcontent.appendChild(content)
    nav = document.createElement("nav")
    nav.className = "level is-mobile"
    left = document.createElement("div")
    left.className = "level-left"
    // reply = document.createElement("a")
    // reply.className = "level-item"
    // reply.onclick = function () {
    //     //document.getElementById(ident.Account).replaceChildren()
    // }
    // span = document.createElement("span")
    // span.className = "icon is-small"
    // icon = document.createElement("i")
    // icon.className = "fas fa-reply"
    // span.appendChild(icon)
    // reply.appendChild(span)
    // left.appendChild(reply)
    nav.appendChild(left)
    mcontent.appendChild(nav)
    article.appendChild(mcontent)
    return article
}