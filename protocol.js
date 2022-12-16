let protocolReady = false
function waitForProtocolReady(callback) {
    var interval = setInterval(function() {
        if (protocolReady) {
            clearInterval(interval);
            callback();
        }
    }, 200);
}

function displayProtocol() {
    document.getElementById("maincontent").replaceChildren(prepWindow())
    document.getElementById("heading").innerText = "Stackerstan Superprotocolo"
    document.getElementById("content").replaceChildren(loadingSign())
    waitForProtocolReady(function () {
        subscribeidentity()
        document.getElementById("content").replaceChildren(renderProtocol())
    })
    //document.getElementById("content").replaceChildren(renderProtocolObjects(document.getElementById("content").clientWidth))
    document.getElementById("details").replaceChildren()
    rewriteURL("protocol")
}

function renderProtocol() {
    let div = document.createElement("div")
    //waitForProtocolReady(function () {
//todo ignition
        let rootProtocol = protocolObjects.get("1a54f1f4ceabd11ef562cbb031f4ed0faf4091606fd9998b574dfb1b887e8b5d")
        div.appendChild(renderProtocolChildren(rootProtocol))
   // })
    return div
}

function renderProtocolChildren(item) {
    let div = document.createElement("div")
    var children = getProtocolChildren(item)
    div.appendChild(renderProtocolItem(item))
    children.forEach(function (child) {
        div.firstChild.childNodes[1].appendChild(renderProtocolChildren(child))
    })
    return div
}

function getProtocolChildren(e) {
    //console.log(e)
    let a = Array()
    e.tags.forEach(function (tag) {
        if (tag[0] === "nests") {
            tag.forEach(function (t) {
                if (t.length === 64) {
                    var child = protocolObjects.get(t)
                    if (child !== undefined) {
                        a.push(child)
                    }
                }
            })
        }
    })
    sortItemsByHeight(a)
    return a
}

function renderProtocolItem(item) {
    let article = document.createElement("div");
    //todo change colours based on status (closed, claimed, open)
    article.className = "box" //"message is-dark"// + getProtocolColour(item);
    article.onmouseover = function () {
        article.style.backgroundColor = "hsl(48, 100%, 67%)"
    }
    article.onmouseleave = function () {
        article.style.backgroundColor = "#ffffff"
    }
    tag = document.createElement("span")
    tag.className = "tag " + getProtocolColour(item)
    tag.innerText = getProtocolObjectType(item)
    tagspacer = document.createElement("span")
    tagspacer.innerText = " "
    content = item.content
    split = content.split(/\r?\n/);
    heading = split.shift()
    content = split
    htext = document.createElement("strong")
    htext.innerText = heading
    var head = document.createElement("div")
    head.className = "is-clickable"
    head.appendChild(tag)
    head.appendChild(tagspacer)
    head.appendChild(htext)
    var suid = document.createElement("div")
    suid.innerText = item.mindmachineUID
    suid.style.fontSize = "x-small"
    head.appendChild(suid)
    //head.className = "content"//"message-header"
    head.onclick = function () {
        showDetails(item)
    }
    children = document.createElement("div")
    children.id = `childrenof` + item.mindmachineUID
    article.appendChild(head)

    article.appendChild(children)
    return article
}

function getProtocolColour(e) {
    let objType = getProtocolObjectType(e)
    switch (objType) {
        case objType = "Definition": {
            return "is-primary"
        }
        case objType = "Goal": {
            return "is-dark"
        }
        case objType = "Rule": {
            return "is-warning"
        }
        case objType = "Invariant": {
            return "is-danger"
        }
        case objType = "Protocol": {
            return "is-link"
        }
    }
}

function getProtocolObjectType(e) {
    var t = ""
    e.tags.forEach(function (tag) {
        if (tag[0] === "kind") {
            t = tag[1]
        }
    })
    return t
}

function newProtocolForm(parentID) {
    let div = document.createElement("div")
    let protocolText = document.createElement("textarea")
    protocolText.placeholder = "Protocol Text"
    protocolText.maxLength = 280
    protocolText.className = "textarea is-primary"

    let typeContainer = document.createElement("div")
    typeContainer.className = "select is-primary"
    let type = document.createElement("select")
    type.appendChild(selectItem("Select"))
    type.appendChild(selectItem("Definition"))
    type.appendChild(selectItem("Goal"))
    type.appendChild(selectItem("Rule"))
    type.appendChild(selectItem("Invariant"))
    type.appendChild(selectItem("Protocol"))
    typeContainer.appendChild(type)

    let supersedes = document.createElement("input")
    supersedes.type = "text"
    supersedes.className = "input is-primary"
    supersedes.style = "width: 100%;"
    supersedes.placeholder = "OPTIONAL: SUID of the item this supersedes"

    let nests = document.createElement("textarea")
    nests.placeholder = "IDs of SSP items that should be nested under this item.\nOne\nPer\nLine"
    nests.className = "textarea is-primary"

    let problemID = document.createElement("input")
    problemID.type = "text"
    problemID.placeholder = "Problem SUID"
    problemID.className = "input is-primary"

    let submitbtn = document.createElement("button")
    submitbtn.textContent = "Submit"
    submitbtn.className = "button is-primary"
    submitbtn.onclick = function () {
        if (!accountIsInIdentityTree(pubKeyMinus2)) {
            alert("You must be in the Identity Tree to do that")
        } else {
            createNewProtocolItem(problemID.value, protocolText.value, type.value, supersedes.value, nests.value, parentID)
            problemID.value = ""
            protocolText.value = ""
            type.value = ""
            supersedes.value = ""
            nests.value = ""
        }
    }
    div.appendChild(protocolText)
    div.appendChild(problemID)
    div.appendChild(supersedes)
    div.appendChild(nests)
    div.appendChild(typeContainer)
    div.appendChild(submitbtn)
    return div
}

function selectItem(name) {
    opt = document.createElement("option")
    opt.value = name.toLowerCase()
    opt.innerText = name
    return opt
}

function createNewProtocolItem(problemID, text, kind, supersedes, nests, parentID) {
    et = makeEvent(text)
    signHash(et.id).then(
        function (result) {
            et.sig = result
            sendIt(et)
            //send it again because for some reason it fails half the fucking time
            sendIt(et)
            //todo ignition
            //let temp = "9565f8017b13e82d2bb9b9fed9e4c5275feffddd820fe416541dcb70eb1416b5"
            sendNewProtocolItem(problemID, et.id, kind, supersedes, nests, parentID)
        },
        function (error) {
            console.log(error)
        })
}

function sendNewProtocolItem(problemID, textID, kind, supersedes, nests, parentID) {
    // if (parentID.length === 64) {
    content = JSON.stringify({
        problem: problemID,
        text: textID,
        kind: kind,
        supersedes: supersedes,
        nests: nests.split(/\r?\n/),
        parent: parentID
    })
    // } else {
    //     content = JSON.stringify({title: titleID, description: descriptionID})
    // }
    p = makeEvent(content, "", 640600)
    signHash(p.id).then(
        function (result) {
            p.sig = result
            sendIt(p)
            console.log(p)
            location.reload()
        }
    )
}