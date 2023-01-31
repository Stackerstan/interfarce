function claimKind() {
    id = makeid(6)
    modal = makeModal(id)
    document.getElementById("content").appendChild(modal)
    return id
}


function makeModal(id) {
    modal = document.createElement("div")
    modal.id = id
    modal.className = "modal"
    modal.classList.add('is-active')

    background = document.createElement("div")
    background.className = "modal-background"

    card = document.createElement("div")
    card.className = "modal-card"

    header = document.createElement("header")
    header.className = "modal-card-head"

    title = document.createElement("p")
    title.className = "modal-card-title"
    title.id = id + "_title"

    closer = document.createElement("button")
    closer.className = "delete"
    closer.ariaLabel = "close"
    closer.onclick = function () {document.getElementById(id).classList.remove('is-active')}



    body = document.createElement("section")
    body.className = "modal-card-body"
    body.id = id + "_body"

    header.appendChild(title)
    header.appendChild(closer)
    card.appendChild(header)
    card.appendChild(body)
    modal.appendChild(background)
    modal.appendChild(card)
    return modal
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
