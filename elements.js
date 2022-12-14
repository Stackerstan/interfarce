function protocolObject(event) {
    let div = document.createElement("div")
    div.onclick = function () {
        document.getElementById("details").innerHTML = renderProtocolEventAsMessage(event)
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
    //div.innerHTML = `<div class="box">` + `<span class="tag is-primary">` + event.tags[0][1] + `</span>` + event.content + `</div>`;
    div.innerHTML = renderProtocolEventAsMessage(event);
    div.id = event.id
    return div
}

function replybox(id) {
    let div = document.createElement("div")
    let textbox = document.createElement("textarea")
    textbox.className = "textarea"
    textbox.id = "reply"
    let submitbtn = document.createElement("button")
    submitbtn.textContent = "Comment"
    submitbtn.className = "button is-primary"
    submitbtn.onclick = function () {
        if (hasPermanym(pubKeyMinus2)) {
            makeNote(textbox.value, id)
            textbox.value = ""
        } else {
            alert("You MUST have a Permanym for your comment to show up here. Go to the My Account page.")
        }
    }
    div.appendChild(textbox)
    div.appendChild(submitbtn)
    return div
}

function print(t) {
    console.log(t)
}

function renderReply(e) {
    let article = document.createElement("article")
    article.className = "message is-primary"
    let div = document.createElement("div")
    div.className = "message-body"
    div.innerText = e.content
    article.appendChild(div)
    return article
}


function renderProtocolEventAsMessage(event) {
    let objType = event.tags[0][1];
    let article = `<article class="message `;
    switch (objType) {
        case objType = "Definition": {
            article += `is-info`
            break
        }
        case objType = "Goal": {
            article += `is-link`
            break
        }
        case objType = "Rule": {
            article += `is-warning`
            break
        }
        case objType = "Invariant": {
            article += `is-danger`
            break
        }
        case objType = "Protocol": {
            article += `is-dark`
            break
        }
    }
    article += `">`
    article += `<div class="message-header">`
    article += `<p>`
    article += `[` + event.tags[0][1] + `] `
    article += event.content
    article += `</p>`
    article += `</div>`
    article += `<div class="message-body">`
    article += `SUID: ` + event.mindmachineUID + ` `
    article += `</div>`
    article += `</article>`
    return article
}