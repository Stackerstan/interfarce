let eventbucketReady = false
function waitForEventBucketReady(callback) {
    var interval = setInterval(function() {
        if (eventbucketReady) {
            clearInterval(interval);
            callback();
        }
    }, 200);
}

let kindReady = false
function waitForKindsReady(callback) {
    var interval = setInterval(function() {
        if (kindReady) {
            clearInterval(interval);
            callback();
        }
    }, 200);
}

function displayKinds() {
    document.getElementById("maincontent").replaceChildren(prepWindow())
    document.getElementById("heading").innerText = "Nostr Event Kind Registry"// spontaneously organising tree of self-published notes and other stuff
    document.getElementById("content").replaceChildren(loadingSign())
    waitForEventBucketReady(function () {
        waitForKindsReady(function () {
            renderKinds()
        })
    })
    rewriteURL("nostr-event-kind-registry")
}

function renderKinds() {
    box = document.createElement("div")
    box.className = "content"
    document.getElementById("content").replaceChildren(box)
    table = document.createElement("table")
    table.className = "table"
    thead = document.createElement("thead")
    theadr = document.createElement("tr")
    theadr.appendChild(createTh("Kind"))
    theadr.appendChild(createTh("Count"))
    theadr.appendChild(createTh("NIPs"))
    theadr.appendChild(createTh("App"))
    theadr.appendChild(createTh("Description"))
    theadr.appendChild(createTh("Curator"))
    thead.appendChild(theadr)
    table.appendChild(thead)
    tbody = document.createElement("tbody")
    eventbucketObjects.forEach(function (v,k) {
        if (v > 0) {
            tbodyr = document.createElement("tr")
            tbodyr.appendChild(createTd(k))
            tbodyr.appendChild(createTd(v))
            tbodyr.appendChild(handleNIPs(k))
            tbodyr.appendChild(handleApp(k))

            if ((k >= 640000) && (k < 650000)) {
                tbodyr.appendChild(createTd("Stackerstan"))
            } else if (k < 8) {
                tbodyr.appendChild(createTd("Generic"))
            } else {
                tbodyr.appendChild(createClaimButton(k)) //
            }


            tbodyr.appendChild(createTd("feature coming soon"))
            tbodyr.appendChild(createClaimButton(k))
            tbody.appendChild(tbodyr)
        }
    })
    table.appendChild(tbody)
    box.appendChild(table)
}

function handleApp(kind) {
    if (kindObjects.get(kind)) {
        var col = createTd()
        var existing = kindObjects.get(kind)
        if (existing.App.length > 0) {
            col.innerText = existing.App
        }  else {
            col.appendChild(createClaimButton(kind))
        }
        return col
    }
    return createClaimButton(kind)
}

function handleNIPs(kind) {
    if (kindObjects.get(kind)) {
        var existing = kindObjects.get(kind)
        var nips = createTd()
        var nipLength = 0
        if (existing.NIPs.length > 0) {
            existing.NIPs.forEach(x => {
                if (x.length > 0) {
                    if (nipLength > 0) {nips.appendChild(" ")}
                    nip = x.substring(x.lastIndexOf('/') + 1)
                    s = nip.split(".")
                    nips.appendChild(makeLink(x, s[0]))
                    nipLength++
                }
            })
        }
        if (nipLength > 0) {
            return nips
            //tbodyr.appendChild(nips)
        } else {
            return createClaimButton(kind)
            //tbodyr.appendChild(createTd("add"))
        }
    } else {
        return createClaimButton(kind)
        //tbodyr.appendChild(createTd("add"))
    }
}

function createTh(title) {
    theadh = document.createElement("th")
    theadh.innerText = title
    return theadh
}

function createTd(inner) {
    theadh = document.createElement("td")
    try {theadh.appendChild(inner)} catch (e) {
        if (typeof inner != "undefined") {
            theadh.innerText = inner
        }
    }
    return theadh
}

function createClaimButton(kind) {
    claim = createTd()
    claimLink = document.createElement("button")
    claimLink.className = "button is-small is-primary"
    claimLink.innerText = "claim"
    claim.onclick = function () {
            modal = claimKind()
            document.getElementById(modal + "_title").innerText = "Nostr Kind " + kind + " events"
            document.getElementById(modal + "_body").appendChild(claimModal(kind, modal))
        //document.getElementById("aboutinput").innerText = "Tell the community who you are so that someone adds you to the Identity Tree."
    }
    claim.appendChild(claimLink)
    return claim
}
function usernameAndBioInstructionsKindsModal() {
    div = document.createElement("div")
    div.appendChild(makeParagraph("The Nostr Kind Registry is built on top of Stackerstan -- a **Stateful** Nostr Client in Golang that gives us some useful infrastructure:   \n* shared global state anchored in Bitcoin   \n* an [Identity Tree](https://stackerstan.org/index.html#identity_tree)   \n* a Maintainer Tree (conceptually similar to Github maintainers)"))
    div.appendChild(makeParagraph("You need to be in the Identity Tree to claim a Kind. Please create a profile below to join the tree."))
    return div
}

function updateBio(modalID, kind) {
    form = document.createElement("div")
    form.appendChild(usernameAndBioInstructionsKindsModal())
    form.appendChild(usernameAndBioForm())
    form.appendChild(bioButtons(function () {
        setBio( document.getElementById( 'name input' ).value, document.getElementById( 'about input' ).value, storedPubkey )
        document.getElementById(modalID + "_body").replaceChildren(claimModal(kind, modalID))
    }))
    return form
}

function claimModal(kind, modalID) {
    box = document.createElement("div")
    //box.innerText = "You are attempting to claim Kind " + kind + " for your application."
    if (!accountIsInIdentityTree(storedPubkey)) {
        box.appendChild(makeParagraph("##### How to claim `Kind " + kind + "` for your application"))
        //box.innerText = box.innerText + "\n\nNote: you need to be in the Identity Tree in order to claim a Kind."
        var waitingForIdentityTree = false
        identityObjects.forEach(function (v) {
            if (v.Account === storedPubkey) {
                waitingForIdentityTree = true
                box.appendChild(makeParagraph("Your account is currently waiting to be added to the [Identity Tree](https://stackerstan.org/index.html#identity_tree)."))
                box.appendChild(makeParagraph("Anyone who is currently in the Identity Tree can add you to it."))
                box.appendChild(makeParagraph("If you've been waiting for an uncomfortable amount of time, please make sure you have some info in your bio/about section, and perhaps also post something to the Samizdatree to introduce yourself."))
            }
        })
        if (!waitingForIdentityTree) {
            box.appendChild(updateBio(modalID, kind))
        }
    }
    if (accountIsInIdentityTree(storedPubkey)) {
        box.appendChild(claimForm(kind))
    }
return box
}

function claimForm(kind) {
    let div = document.createElement("div")
    div.appendChild(makeParagraph("#### Modifying `kind " + kind + "`"))
    div.appendChild(makeTextInput("NIP URL", "https://github-or-something.com/path/to/nip.md", "nip_url", 100, ""))
    var app_name_existing = ""
    var description_existing = ""
    var nips_existing = []
    if (kindObjects.get(kind)) {
        if (kindObjects.get(kind).App.length > 0) {
            app_name_existing = kindObjects.get(kind).App
        }
        if (kindObjects.get(kind).Description.length > 0) {
            description_existing = kindObjects.get(kind).Description
        }
    }
    div.appendChild(makeTextInput("App Name", "Name of your project or app using this kind", "app_name", 20, app_name_existing))
    div.appendChild(makeTextField("Description", "Describe what Events of this Kind are used for", "kind_description", 280, description_existing))
    div.appendChild(makeButton("Do it!", function () {
        sendClaim(kind, element("nip_url").valueOf().value, element("app_name").valueOf().value, element("kind_description").value)
        element("nip_url").valueOf().value = ""
        element("app_name").valueOf().value = ""
        element("kind_description").valueOf().value = ""
    }))
    div.appendChild(spacer())
    div.appendChild(makeButton("Clear", function () {
        element("nip_url").valueOf().value = ""
        element("app_name").valueOf().value = ""
        element("description").valueOf().value = ""
    }, "is-link is-light"))
    return div
}

function sendClaim(kind, nip, app, description) {
    existing = kindObjects.get(kind)
    seq = 0
    if (existing) {
        console.log(existing.Sequence, typeof existing.Sequence)
        seq = existing.Sequence
    }
    seq++
    let c = JSON.stringify({kind: kind, nip: nip, app: app, description: description, sequence: seq})
    sendEventToMindmachine(c, "", 641800, storedPubkey).then(x => {console.log(175)})
}

function makeButton(name, onclick, style) {
    let button = document.createElement("button")
    button.className = "button"
    if (style) {
        button.className = button.className + " " + style
    } else {
        button.className = button.className + " " + "is-link"
    }
    button.innerText = name
    button.onclick = onclick
    return button
}

function element(id) {
    elem = document.getElementById(id)
    if (elem) {
        return elem
    }
    console.log("failed to find element " + id)
}