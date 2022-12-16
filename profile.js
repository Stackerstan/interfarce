function renderOneProfile(id) {
    ident = identityObjects.get(id)
    if (ident !== undefined) {
        document.getElementById("content").replaceChildren(getProfileHtml(ident))
    } else {
        document.getElementById("content").replaceChildren(createElement("Account", "Not Found"))
    }
}

function displaySingleProfile(id) {
    if (id.length === 64) {
        document.getElementById("maincontent").replaceChildren(prepWindow("doki_id"))
        waitForDokiReady(function () {
            renderOneProfile(id)
        })
    }
}

function getProfileHtml(ident) {
    deets = document.createElement("div")
    deets.className = "content"
    deets.appendChild(createElement("Account", ident.Account))
    deets.appendChild(createElement("Name", ident.Name))
    deets.appendChild(createElement("About", ident.About))
    if (ident.UshBy.length > 0) {
        deets.appendChild(createElement("Added to Identity Tree By:", ident.UshBy))
    } else {
        ush = createElement("This account is not in the Identity Tree", "If you believe the person who controls this account is human and does not have any other accounts, you can add them to the Identity Tree now.")
        ushinner = document.createElement("div")
        ushinner.className = "content"
        ushinner.innerText = "By validating this account as a Unique Sovereign Human (adding this account to the Identity Tree), you declare that you\n 1. believe this account is owned and controlled by a human, and\n  2. you do not believe they have any other account(s)\n"
        ushinner.appendChild(validateUSHButton(ident.Account))
        ush.appendChild(ushinner)
        deets.appendChild(ush)
    }

    if (ident.MaintainerBy.length > 0) {
        deets.appendChild(createElement("Promoted to Maintainer by:", ident.MaintainerBy))
    } else {
        m = createElement("This account is not a Maintainer", "If you are a Maintainer, you can make this person a Maintainer too.")
        minner = document.createElement("div")
        minner.className = "content"
        minner.innerText = "By making this Participant a Maintainer, you declare that you believe the Participant understands the spirit and the letter of the Stackerstan Superprotocolo, and you will remove them as a Maintainer if they ever demonstrate otherwise\n"
        minner.appendChild(maintainerButton(ident.Account))
        m.appendChild(minner)
        deets.appendChild(m)
    }

    return deets
}

function maintainerButton(Account) {
    btn = document.createElement("button")
    btn.innerText = "Promote to Maintainer"
    btn.onclick = function () {
        if (!accountIsInMaintainerTree(pubKeyMinus2)) {
            alert("You must be in the Maintainer Tree to do this")
        } else {
            sendNewMaintainer(Account)
        }
    }
    return btn
}

function sendNewMaintainer(targetAccount) {
    sequence = 0
    if (identityObjects.get(pubKeyMinus2) !== undefined) {
        sequence = identityObjects.get(pubKeyMinus2).Sequence
    }
    sequence++
    content = JSON.stringify({
        target: targetAccount,
        Maintainer: true,
        sequence: sequence
    })
    p = makeEvent(content, "", 640402)
    signHash(p.id).then(
        function (result) {
            p.sig = result
            sendIt(p)
            console.log(p)
            location.reload()
        }
    )
}

function validateUSHButton(Account) {
    btn = document.createElement("button")
    btn.innerText = "Add to Identity Tree"
    btn.onclick = function () {
        if (!accountIsInIdentityTree(pubKeyMinus2)) {
            alert("You must be in the Identity Tree to add new people")
        } else {
            sendNewUshValidation(Account)
        }
    }
    return btn
}

function sendNewUshValidation(targetAccount) {
    sequence = 0
    if (identityObjects.get(pubKeyMinus2) !== undefined) {
        sequence = identityObjects.get(pubKeyMinus2).Sequence
    }
    sequence++
    content = JSON.stringify({
        target: targetAccount,
        USH: true,
        sequence: sequence
    })
    p = makeEvent(content, "", 640402)
    signHash(p.id).then(
        function (result) {
            p.sig = result
            sendIt(p)
            console.log(p)
            location.reload()
        }
    )
}

function accountIsInIdentityTree(account) {
    ident = identityObjects.get(account)
    if (ident !== undefined) {
        if (ident.UshBy.length > 0) {
            return true
        }
    }
    return false
}

function accountIsInMaintainerTree(account) {
    ident = identityObjects.get(account)
    if (ident !== undefined) {
        if (ident.MaintainerBy.length > 0) {
            return true
        }
    }
    return false
}

function myIdentity() {
   ident = identityObjects.get(pubKeyMinus2)
    if (ident !== undefined) {
        return ident
    } else {
        console.log("the account " + pubKeyMinus2 + " has not been registered in the Mindmachine state.")
        return false
    }
}