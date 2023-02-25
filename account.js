function displayAccount() {
    getMuhPubkey().then(pubkey => {
        storedPubkey = pubkey
        document.getElementById("maincontent").replaceChildren(prepWindow())
        document.getElementById("heading").innerText = "Account Details (Currently logged in)"
        document.getElementById("content").replaceChildren(renderAccountDetails(pubkey))
        document.getElementById("details").replaceChildren(updateAccountDetails(pubkey), document.createElement("br"), recoverSeed(pubkey))
    })
}

function isParticipant(pubkey) {
    let ident;
    ident = identityObjects.get(pubkey)
    if (typeof ident === "undefined") {
        //
    } else {
        if (ident.UshBy.length > 0) {
            return true
        }
    }
    return false
}

function hasPermanym(pubkey) {
    let ident;
    ident = identityObjects.get(pubkey)
    if (typeof ident === "undefined") {
        //
    } else {
        if (ident.Name.length > 0) {
            return true
        }
    }
    return false
}

function renderAccountDetails(pubkey) {
    // console.log("redering")
    deets = document.createElement("div")
    deets.className = "content"
    let ident;
    ident = identityObjects.get(pubkey)

    if (typeof ident === "undefined") {
        ident = {Account: pubkey, Name: "", About: "", UshBy: ""}
    }

    deets.appendChild(createElement("Help", "A new account and corrosponding seed words are generated when you first load this page. \nTo generate a new account, clear your browser's data for this site and reload it.\nIf you start using this account, you should write down your seed words (especially if you claim a Username that you want to keep)."))
    deets.appendChild(createElement("Pubkey", ident.Account))
    if (window.nostr) {
        deets.appendChild(createElement("Seed Words", "You are using a browser plugin to manage your private key(s), please refer to that for your recovery options."))
    } else {
        deets.appendChild(createElement("Seed Words - write these down if you want to continue using this Account.", localStorage.getItem('backupwords')))
    }
    deets.appendChild(createElement("Username (permanent psudonym)", ident.Name))
    deets.appendChild(createElement("About", ident.About))
    var ushby;
    if (ident.UshBy.length > 0) {
        ushby = ident.UshBy
    } else {
        ushby = "No one has validated that you are human yet. Post a message in the Samizdat tree to ask."
    }
    LeadTimeLockedShares = 0
    LeadTime = 0
    LeadTimeUnlockedShares =  0
    approvedExpensesnum = 0
    filedExpenses = 0
    if (sharesObjects.get(pubkey)){
        sharesObjects.get(pubkey).LeadTimeLockedShares ? LeadTimeLockedShares = sharesObjects.get(pubkey).LeadTimeLockedShares : 0 ;
        sharesObjects.get(pubkey).LeadTime ? LeadTime = sharesObjects.get(pubkey).LeadTime : 0 ;
        sharesObjects.get(pubkey).LeadTimeUnlockedShares ? LeadTimeUnlockedShares = sharesObjects.get(pubkey).LeadTimeUnlockedShares : 0 ;
        approvedExpensesnum = approvedExpenses(sharesObjects.get(pubkey).Expenses)
        sharesObjects.get(pubkey).Expenses ? filedExpenses = sharesObjects.get(pubkey).Expenses.length : 0 ;
    }
    deets.appendChild(createElement("Added to the Participant Tree by:", ushby))
    deets.appendChild(createElement("Vouched for by", "no one has vouched for you yet"))
    deets.appendChild(createElement("Total Shares", LeadTimeUnlockedShares+LeadTimeLockedShares))
    deets.appendChild(createElement("Lead Time", LeadTime))
    deets.appendChild(createElement("Lead Time Unlocked Shares", LeadTimeUnlockedShares))
    deets.appendChild(createElement("Lead Time Locked Shares", LeadTimeLockedShares))
    deets.appendChild(createElement("Voting Power", LeadTime*LeadTimeLockedShares))
    deets.appendChild(createElement("Maintainer", accountIsInMaintainerTree(pubkey)))
    deets.appendChild(createElement("Problems Logged", "0"))
    deets.appendChild(createElement("Problems Claimed", "0"))
    deets.appendChild(createElement("Problems Solved", "0"))
    deets.appendChild(createElement("Expenses Filed", filedExpenses))
    deets.appendChild(createElement("Expenses Approved", approvedExpensesnum))
    return deets
}

function approvedExpenses(expensesObject){
    let num = 0
    if (expensesObject) {
        expensesObject.forEach(function(v){
            if (v.Approved === true){  num++}
        })
    }
    return num
}

function createElement(key, value) {
    box = document.createElement("div")
    box.className = "box"
    if (key) {
        k = document.createElement("strong")
        k.innerText = key
        box.appendChild(k)
        box.appendChild(document.createElement("br"))
    }
    if (value) {
        v = document.createElement("p")
        v.innerText = value
        box.appendChild(v)
    }

    return box
}

function recoverSeed(pubkey) {
    if (!window.nostr) {
        div = document.createElement("div")
        ident = identityObjects.get(pubkey)
        div.appendChild(makeH3("Import your existing account"))
        div.appendChild(makeParagraph("If you previously created an account on Stackerstan you can import it here, but you **should** use a browser extension such as getAlby or Nos2x instead."))
        form = document.createElement("div")
        form.innerHTML = `
<div class="field">
  <label class="label">Seed Words OR Private Key</label>
  <div class="control">
    <textarea class="textarea" placeholder="Paste your seed words OR your private key here" id="seed input"></textarea>
  </div>
</div>

<div class="field is-grouped">
  <div class="control">
    <button class="button is-link" onclick="restoreAccount( document.getElementById('seed input').value); location.reload()">Submit</button>
  </div>
  <div class="control">
    <button class="button is-link is-light" onclick="document.getElementById('seed input').value = '';">Cancel</button>
  </div>
</div>
    `
        div.appendChild(form)
        return div
    }
    return document.createElement("p")
}

function restoreAccount(data) {
    if (data.length === 64) {
        localStorage.removeItem("backupwords")
        localStorage.setItem("privatekey", data)
        location.reload()
    }
    localStorage.setItem('backupwords', data)
    location.reload()
}

function updateAccountDetails() {
    form = document.createElement("div")
    form.appendChild(usernameAndBioForm())
    form.appendChild(bioButtons(function () {
        if (document.getElementById( 'name input' ).valueOf().readOnly) {
            setBio( "", document.getElementById( 'about input' ).value, storedPubkey )
            //location.reload()
        } else {
            validateUnique(document.getElementById( 'name input' ).value).then(res => {
                if (res) {
                    setBio( document.getElementById( 'name input' ).value, document.getElementById( 'about input' ).value, storedPubkey )
                    //location.reload()
                } else {
                    console.log()
                    alert(document.getElementById( 'name input' ).value + " has been taken, please try another username")
                }
            })
        }

    }))
return form
}

async function validateUnique(name) {
    p = new Promise((resolve, reject) => {
        identityObjects.forEach(function (v) {
            if (v.Name === name) {
                resolve(false)
            }
        })
        resolve(true)
    })
    return p
}

function bioButtons(onclick) {
    submit = document.createElement("button")
    submit.onclick = onclick
    submit.className = "button is-link"
    submit.innerText = "Submit"
    cancel = document.createElement("button")
    cancel.onclick = function () {
        document.getElementById('name input').value = '';document.getElementById('about input').value = '';
    }
    cancel.className = "button is-link is-light"
    cancel.innerText = "Clear"

    buttons = document.createElement("div")
    buttons.className = "field is-grouped"

    control = document.createElement("div")
    control.className = "control"

    control.appendChild(submit)
    control.appendChild(spacer())
    control.appendChild(spacer())
    control.appendChild(cancel)
    buttons.appendChild(control)
    return buttons
}

function usernameAndBioForm() {
    div = document.createElement("div")
    let username = ""
    let about = ""
    let haveExistingKind0 = false
    if (kind0Objects.get(storedPubkey) !== undefined) {
        if (kind0Objects.get(storedPubkey).name.length > 0) {
            username = kind0Objects.get(storedPubkey).name
            haveExistingKind0 = true
        }
        if (kind0Objects.get(storedPubkey).about.length > 0) {
            about = kind0Objects.get(storedPubkey).about
            haveExistingKind0 = true
        }
    }
    div.appendChild(makeH3("Create or modify your Stackerstan profile"))
    div.appendChild(makeParagraph("* Stackerstan usernames **cannot** be changed once set for your Pubkey   \n* Stackerstan usernames **must** be unique   \n* Protocol: [Non-fungible Identity](superprotocolo://b66541b20c8a05260966393938e2af296c1a39ca5aba8e21bd86fcce2db72715)"))
    if (haveExistingKind0) {
        div.appendChild(makeParagraph("Submit this form to claim _**" + kind0Objects.get(storedPubkey).name + "**_ now."))
    }
    div.appendChild(makeTextInput("Username", "Name or Pseudonym", "name input", 20, username))

    div.appendChild(makeTextField("About Me", "Introduce yourself to the community", "about input", 560, about))
    return div
}

function makeParagraph(markdown) {
    d = document.createElement("div")
    md = new showdown.Converter({
        extensions: [...bindings]
    })
    ht = md.makeHtml(markdown)
    mdht = document.createElement("div")
    mdht.innerHTML = ht
    d.appendChild(mdht)
    d.appendChild(document.createElement("br"))
    return d
}

function makeLink(url, text) {
    a = document.createElement("a")
    a.href = url
    a.innerText = text
    return a
}

function makeH3(title) {
    h3 = document.createElement("h3")
    h3.className = "is-3"
    h3.innerText = title
    return h3
}

function makeTextField(label, placeholder, id, maxlength, existing) {
    input = document.createElement("textarea")
    input.className = "textarea"
    if (existing.length > 0) {
        input.value = existing
    }
    input.placeholder = placeholder
    input.id = id
    input.maxLength = maxlength
    return makeFormField(label, input)
}

function makeTextInput(label, placeholder, id, maxlength, existing) {
    d = document.createElement("div")
    textInput = document.createElement("input")
    d.appendChild(textInput)
    textInput.className = "input"
    textInput.type = "text"
    if (existing.length > 0) {
        textInput.value = existing
    }
    textInput.placeholder = placeholder
    textInput.id = id
    textInput.maxLength = maxlength

    if (label === "Username") {
        var userameIsAlreadySet = false
        identityObjects.forEach(function (v) {
            if (v.Account === storedPubkey) {
                if (v.Name.length > 0) {
                    textInput.value = v.Name
                    textInput.readOnly = true
                    userameIsAlreadySet = true
                }
            }
        })
        if (!userameIsAlreadySet) {
            warn = document.createElement("p")
            warn.style.display = "none"
            identityObjects.forEach(function (v) {
                if (v.Name === existing) {
                    warn.style.display = "block"
                }
            })
            warn.innerText = "username is taken!"
            if (existing.length < 1) {
                warn.innerText = "username is too short!"
            }
            warn.style.color = "#FF9900"

            textInput.onkeyup = function () {
                warn.style.display = "none"
                if (textInput.value.length < 1) {
                    warn.innerText = "username is too short!"
                    warn.style.display = "block"
                }
                identityObjects.forEach(function (v) {
                    if ((v.Name === textInput.value)&&(textInput.value.length > 0)) {
                        warn.innerText = "username is taken!"
                        warn.style.display = "block"
                    }
                })
            }
            d.appendChild(warn)
        }
    }

    if (label === "Amount") {
        warn = document.createElement("p")
        warn.style.display = "none"
        textInput.type = "number"
        textInput.onkeyup = function () {
            warn.style.display = "none"
            int = parseInt(textInput.value, 10)
            if (!int) {
                warn.style.color = "#FF9900"
                warn.innerText = "must be a number!"
                warn.style.display = "block"
            } else {
                if (USD) {
                    usdAmount = ((int/100000000)*USD).toFixed(2)
                    warn.innerText = "Approximate amount in Cuckbucks:  $" + usdAmount
                    warn.style.color = "#35be33"
                    warn.style.display = "block"
                } else {
                    console.log("could not get USD")
                }
            }
        }
        d.appendChild(warn)
    }
    return makeFormField(label, d)
}

function makeFormField(label, input) {
    if (label === "About") {
        //todo populate from existing data if exists
    }
    field = document.createElement("div")
    field.className = "field"
    field.appendChild(makeLabel(label))
    control = document.createElement("div")
    control.className = "control"
    control.appendChild(input)
    field.appendChild(control)
    return field
}

function makeLabel(name) {
    label = document.createElement("label")
    label.className = "label"
    label.innerText = name
    return label
}


function setBio(name, about, pubkey) {
    if ((name.length > 0) || (about.length > 0)) {
        sequence = 0
        if (identityObjects.get(pubkey) !== undefined) {
            sequence = identityObjects.get(pubkey).Sequence
        }
        sequence++
        content = JSON.stringify({name: name, about: about, sequence: sequence})
        sendEventToMindmachine(content, "", 640400, pubkey).then(x =>{
            location.reload()
            //if (reload) {location.reload()}
        })
    } else {
        console.log("username and bio can't both be empty")
    }
}

function opReturnForm() {
    let div = document.createElement("div")
    head = document.createElement("h3")
    head.className = "is-3"
    head.innerText = "Register OP_RETURN address for your pubkey"
    div.appendChild(head)
    let address = document.createElement("input")
    address.type = "text"
    address.placeholder = "Bitcoin Address"
    address.className = "input is-primary"
    let proof = document.createElement("textarea")
    proof.className = "textarea"
    proof.placeholder = "Proof (BIP322 of your pubkey)"
    proof.className = "textarea is-primary"
    let submitbtn = document.createElement("button")
    submitbtn.textContent = "Make it so"
    submitbtn.className = "button is-primary"
    submitbtn.onclick = function () {
        setOpReturn(address.value, proof.value)
        proof.value = ""
        address.value = ""
    }
    div.appendChild(address)
    div.appendChild(proof)
    div.appendChild(submitbtn)
    return div
}

function setOpReturn(address, proof, pubkey) {
    sequence = 0
    if (identityObjects.get(pubkey) !== undefined) {
        sequence = identityObjects.get(pubkey).Sequence
    }
    sequence++
    let content = {"address": address, "proof": proof, sequence: sequence}
    let c = JSON.stringify(content)
    sendEventToMindmachine(c, "", 640406, pubkey).then(res => {
        console.log(res)
        location.reload()
    })
}

