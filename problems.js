let problemsReady = false
function waitForProblemsReady(callback) {
    var interval = setInterval(function() {
        if (problemsReady) {
            clearInterval(interval);
            callback();
        }
    }, 200);
}

function displayProblemTracker() {
    document.getElementById("maincontent").replaceChildren(prepWindow())
    document.getElementById("heading").innerText = "Problem Tracker"
    document.getElementById("content").replaceChildren(dokiInABubble("70dcc8dc346bf8d7c246b54d7baa1ecc6a087448c58947a2f5a1df7bd27bf761"), loadingSign())
    waitForProblemsReady(function () {
        document.getElementById("content").replaceChildren(dokiInABubble("70dcc8dc346bf8d7c246b54d7baa1ecc6a087448c58947a2f5a1df7bd27bf761"), renderProblems())
    })
    document.getElementById("details").replaceChildren()
    rewriteURL("problems")
}

function gitstuff() {
    h = document.createElement("h5")
    h.className = "is-5"
    h.innerText = "This problem tracker is pretty crap"
    let p = "It will probably get better, but for now:\n\n"
    md = new showdown.Converter({
        extensions: [...bindings]
    })
    ht2 = md.makeHtml(p)
    mdht2 = document.createElement("div")
    mdht2.innerHTML = ht2
    mdht2.className = "content"
    box = document.createElement("div")
    box.className = "notification is-primary"
    box.appendChild(h)
    box.appendChild(mdht2)
    return box
}

function renderProblems() {
    let div = document.createElement("div")
    let rootProblems = getOrderedRootProblems();
    rootProblems.forEach(function (item) {
        div.appendChild(renderChildren(item))
    })
    console.log(div,'222222222222222222222222222')
    return div
}

function renderChildren(item) {
    let div = document.createElement("div")
    div.appendChild(renderProblem(item))
    getChildren(item.mindmachineUID).forEach(function (child) {
        //div.firstChild.childNodes[1].appendChild(renderProblem(child))
        div.firstChild.childNodes[1].appendChild(renderChildren(child))
    })
    return div
}

function getChildren(id) {
    children = []
    problemObjects.forEach(function (item) {
        var parent = getParent(item)
        if (parent != null) {
            if (parent.mindmachineUID === id) {
                children.push(item)
            }
        }

    })
    sortItemsByHeight(children)
    return children
}


function getOrderedProblemsThatHaveParents() {
    var m = new Map();
    problemObjects.forEach(function (item) {
        if (hasParent(item)) {
            m.set(item.mindmachineUID, item)
        }
    })
    tosort = []
    m.forEach(function (item) {
        tosort.push(item)
    })
    sortItemsByHeight(tosort)
    return tosort
}

function getOrderedRootProblems() {
    var m = new Map();
    problemObjects.forEach(function (item) {
        var root = findRoot(item)
        m.set(root.mindmachineUID, root)
    })
    tosort = []
    m.forEach(function (item) {
        tosort.push(item)
    })
    sortItemsByHeight(tosort)
    return tosort
}

function sortItemsByHeight(items) {
    items.sort(function (a, b) {
        var aheight = parseInt(getTag("height", a), 10)
        var bheight = parseInt(getTag("height", b), 10)
        return aheight > bheight
    })
    return items
}

function hasParent(item) {
    var parentID = getTag("parent", item)
    if (parentID.length !== 64) {
        return false
    }
    var parent = problemObjects.get(parentID)
    if (parent === undefined) {
        return false
    }
    return true
}

function getParent(item) {
    var parentID = getTag("parent", item)
    if (parentID.length !== 64) {
        return null
    }
    var parent = problemObjects.get(parentID)
    if (parent !== undefined) {
        return parent
    }
}

function findRoot(item) {
    var parentID = getTag("parent", item)
    if (parentID.length !== 64) {
        return item
    }
    var parent = problemObjects.get(parentID)
    if (parent === undefined) {
        return item
    }
    return findRoot(parent)
}


function renderProblem(item,collapse=true) {
    
    let article = document.createElement("article");
    //todo change colours based on status (closed, claimed, open)
    article.className = "message is-dark";
    article.style.borderColor = "#ffffff"
    article.style.borderStyle = "solid"
    article.style.borderWidth = "1px"
    content = item.content
    // split = content.split(/\r?\n/);
    // heading = split.shift()
    // content = split
    htext = document.createElement("p")
    htext.innerText = getTitle(item)
    var head = document.createElement("div").appendChild(htext)
    head.className = "message-header"
    head.style = "cursor: pointer;"
    
    md = new showdown.Converter({
        extensions: [...bindings]
    })
    //console.log(showdown.getDefaultOptions(md))
    ht = md.makeHtml(item.content)
    mdht = document.createElement("div")
    mdht.innerHTML = ht
    mdht.className = "problem-body"
    if (collapse==true){mdht.style.display='none'}
    else{mdht.style.display='block'}
    
    desc = document.createElement("div")
    desc.className = "message-body";
    desc.style.display='block'
    desc.appendChild(mdht)
    //desc.innerText = item.content//content
    //desc.appendChild(document.createElement("br"))
    //desc.appendChild(document.createElement("br"))
    if (item.kind === 640899) {
        var claimed_by = document.createElement("div");
        claimedby = getClaimedBy(item)
        if (claimedby.length > 0) {
            claimed_by.innerText = "Claimed by: " + claimedby
        } else {
            claimed_by.innerText = "Claimed by: not yet claimed by anyone"
        }
        claimed_by.style.fontSize = "x-small"
        desc.appendChild(claimed_by)
    }
    var suid = document.createElement("div");
    suid.innerText = "SUID: " + item.mindmachineUID
    suid.style.fontSize = "x-small"
    desc.appendChild(suid)
    desc.appendChild(document.createElement("br"))
    desc.id = `childrenof` + item.mindmachineUID

    article.appendChild(head)

    head.onclick = function () {
        showDetails(item)

        if(document.getElementById(`childrenof` + item.mindmachineUID).firstChild.style.display=='block'){
                 
                    document.getElementById(`childrenof` + item.mindmachineUID).firstChild.style.display='none'
                  
                      
        } else {
            document.getElementById(`childrenof` + item.mindmachineUID).firstElementChild.style.display='block'
        }

        
      

        
      
    }
    desc_ = document.createElement("div")
    desc_.className = "message-body";
    article.appendChild(desc)
    return article
}
function collapseProblem(article){


}

function showDetails(event) {
    document.getElementById("details").replaceChildren()
    document.getElementById("details").appendChild(renderProblem(event,false))
    if (event.kind === 640899) {
        let claim_div = document.createElement("div")
        let claim_btn = document.createElement("button")
        claim_btn.innerText = "Claim this problem"
        claim_btn.className = "button is-primary"
        claim_btn.onclick = function () {
            if (!accountIsInIdentityTree(pubKeyMinus2)) {
                alert("You must be in the Identity Tree to do that")
            } else {
                seq = Number(getSequence(event))
                seq++
                content = JSON.stringify({"target": event.mindmachineUID, "claim": true, "sequence": seq})
                claim_event = makeEvent(content, event.mindmachineUID, 640802)
                signHash(claim_event.id).then(
                    function (result) {
                        claim_event.sig = result
                        sendIt(claim_event)
                        console.log(claim_event)
                        location.reload()
                    }
                )
            }

        }
        claim_div.appendChild(claim_btn)
        newProblem = document.createElement("button")
        newProblem.className = "button is-link"
        newProblem.onclick = function () {
            if (!accountIsInIdentityTree(pubKeyMinus2)) {
                alert("You must be in the Identity Tree to do that")
            } else {
                document.getElementById("details").appendChild(newProblemForm(event.mindmachineUID))
            }
        }
        newProblem.innerText = "Create child problem"
        //document.getElementById("details").appendChild(newProblem)
        claim_div.appendChild(newProblem)

        editProblem = document.createElement("button")
        editProblem.className = "button is-link"
        editProblem.onclick = function () {
            if (!accountIsInIdentityTree(pubKeyMinus2)) {
                alert("You must be in the Identity Tree to do that")
            } else {
                document.getElementById("details").appendChild(editProblemForm(event))
            }
        }
        editProblem.innerText = "Edit Problem"
        claim_div.appendChild(editProblem)

        document.getElementById("details").appendChild(claim_div)
        document.getElementById("details").appendChild(document.createElement("br"))
    }

    if (event.kind === 640699) {
        newProtocol = document.createElement("button")
        newProtocol.className = "button is-link"
        newProtocol.onclick = function () {
            if (!accountIsInIdentityTree(pubKeyMinus2)) {
                alert("You must be in the Identity Tree to do that")
            }
            document.getElementById("details").appendChild(newProtocolForm(event.mindmachineUID))
        }
        newProtocol.innerText = "Create child protocol item"
        document.getElementById("details").appendChild(newProtocol)
    }

    var repl = replies.get(event.mindmachineUID)
    var orderedReplies = []
    if (repl !== undefined) {
        repl.forEach(function (e) {
            // var replyDiv = document.createElement("div")
            // replyDiv.innerHTML = e.content
            orderedReplies.push(e)
            //document.getElementById("details").appendChild(renderReply(e))
        })
        orderedReplies.sort(function (a, b) {
            return a.created_at > b.created_at
        })
        orderedReplies.forEach(function (e) {
            document.getElementById("details").appendChild(renderReply(e))
        })
    }
    document.getElementById("details").appendChild(replybox(event.mindmachineUID))
}

function editProblemForm(item) {
    let div = document.createElement("div")
    let title = document.createElement("input")
    title.type = "text"
    titletext = getTitle(item)
    title.value = titletext
    title.className = "input is-link"
    let textbox = document.createElement("textarea")
    textbox.className = "textarea"
    textbox.textContent = item.content
    let submitbtn = document.createElement("button")
    submitbtn.textContent = "Submit Changes"
    submitbtn.className = "button is-primary"
    submitbtn.onclick = function () {
        //todo if no changes to title then send empty string, same for content.
        createNewEdit(title.value, textbox.value, item)
        textbox.value = ""
        title.value = ""
    }
    div.appendChild(title)
    div.appendChild(textbox)
    div.appendChild(submitbtn)
    return div
}

function createNewEdit(newTitle, newContent, item) {
    if ((newTitle.length > 0) && (newContent.length > 0)) {
        let et = makeEvent(newTitle)
        signHash(et.id).then(
            function (result) {
                et.sig = result
                sendIt(et)
                let ec = makeEvent(newContent)
                signHash(ec.id).then(
                    function (result) {
                        ec.sig = result
                        sendIt(ec)
                        content = JSON.stringify({target: getMindmachineUID(item), sequence: Number(getSequence(item))+1, title: et.id, description: ec.id})
                        if (identityObjects.get(pubKeyMinus2).GlobalSequence !== undefined) {
                            p = makeEvent(content, "", 640802)
                            signHash(p.id).then(
                                function (result) {
                                    p.sig = result
                                    sendIt(p)
                                    console.log(p)
                                }
                            )
                        } else {
                            alert("please set your keypair")
                        }
                    },
                    function (error) {
                        console.log(error)
                    })
            },
            function (error) {
                console.log(error)
            })
    }
}

function newProblemForm(parentID) {
    let div = document.createElement("div")
    let title = document.createElement("input")
    title.type = "text"
    title.placeholder = "Problem title"
    title.className = "input is-link"
    let textbox = document.createElement("textarea")
    textbox.className = "textarea"
    textbox.placeholder = "problem text (markdown)"
    textbox.id = "reply"
    let submitbtn = document.createElement("button")
    submitbtn.textContent = "Create Problem"
    submitbtn.className = "button is-primary"
    submitbtn.onclick = function () {
        createNewProblem(title.value, textbox.value, parentID)
        textbox.value = ""
        title.value = ""
    }
    div.appendChild(title)
    div.appendChild(textbox)
    div.appendChild(submitbtn)
    return div
}

function createNewProblem(title, description, parent) {
    et = makeEvent(title)
    signHash(et.id).then(
        function (result) {
            et.sig = result
            sendIt(et)
            if (description.length > 0) {
                ed = makeEvent(description)
                signHash(ed.id).then(
                    function (result) {
                        ed.sig = result
                        sendIt(ed)
                        sendNewProblem(et.id, ed.id, parent)
                    }
                )
            } else {
                sendNewProblem(et.id, "", parent)
            }
        },
        function (error) {
            console.log(error)
        })
}

function sendNewProblem(titleID, descriptionID, parentID) {
    if (parentID.length === 64) {
        content = JSON.stringify({title: titleID, description: descriptionID, parent: parentID})
    } else {
        content = JSON.stringify({title: titleID, description: descriptionID})
    }
    if (identityObjects.get(pubKeyMinus2).GlobalSequence !== undefined) {
        p = makeEvent(content, "", 640800)
        signHash(p.id).then(
            function (result) {
                p.sig = result
                sendIt(p)
                console.log(p)
                location.reload()
            }
        )
    } else {
        alert("please set your keypair")
    }

}