var currentStatus = 0

const identityObjects = new Map();

// function waitForEverythingReady(callback) {
//     var interval = setInterval(function() {
//         if (relaySocket) { //&& dokiReady && samizdatReady && protocolReady && problemsReady
//             clearInterval(interval);
//             callback();
//         }
//     }, 200);
// }

function waitForRelaySocketReady(callback) {
    var interval = setInterval(function() {
        if (relaySocket) {
            clearInterval(interval);
            callback();
        }
    }, 200);
}
function enMapIdentityObject(e) {
    //console.log(e.content)
    c = JSON.parse(e.content)
    //console.log(c)
    identityObjects.set(c.Account, c)
    //console.log(identityObjects.get(pubKeyMinus2).Sequence)
}

const protocolObjects = new Map();

function enMapProtocolObject(e) {
    e.mindmachineUID = getMindmachineUID(e)
    protocolObjects.set(e.mindmachineUID, e)
    subscribeToReplies(e)
}

const problemObjects = new Map();

function enMapProblemObject(e) {
    e.mindmachineUID = getMindmachineUID(e)
    problemObjects.set(e.mindmachineUID, e)
    subscribeToReplies(e)
}

const samizdatObjects = new Map();

function enMapSamizdat(e) {
    samizdatObjects.set(e.id, e)
}

const replies = new Map();

function enMapReply(protocolUID, e) {
   // subscribeToReplies(e)
    var existing = replies.get(protocolUID)
    if (existing !== undefined) {
        existing.set(e.id, e)
        replies.set(protocolUID, existing)
    } else {
        repliesTo = new Map()
        repliesTo.set(e.id, e)
        replies.set(protocolUID, repliesTo)
    }
}

var alreadySubscribed = new Map()
function subscribeToReplies(e) {
    if (!alreadySubscribed.has(e)) {
        if (relaySocket) {
            executeSubscribe(e)
            alreadySubscribed.set(e, true)
        }
        if (!relaySocket) {
            waitForRelaySocketReady(function () {
                executeSubscribe(e)
                alreadySubscribed.set(e, true)
            })
        }
    }
}

function executeSubscribe(e) {
    if (e.mindmachineUID !== undefined) {
        subscribeToComments(e.mindmachineUID)
    } else if (e.id !== undefined){
        subscribeToComments(e.id)
    } else {
        if (e.length === 64) {
            subscribeToComments(e)
        }
    }

    relaySocket.addEventListener('message', function (received) {
        let parsed = JSON.parse(received.data);
        if (parsed[0] !== "EOSE") {
            parsed[2].tags.forEach(function (tag) {
                if (tag[0] === "e") {
                    tag.forEach(function (tagContent) {
                        if (tagContent === e.mindmachineUID) {
                            enMapReply(e.mindmachineUID, parsed[2])
                        } else if (tagContent === e.id) {
                            enMapReply(e.id, parsed[2])
                        } else if (tagContent === e) {
                            enMapReply(e, parsed[2])
                        }
                    })
                }
            })
            if (parsed[2].id === e) {
                enMapReply(e, parsed[2])
            }
        }

    })
}


function renderProtocolObjects(width) {
    let rootProtocolObject = protocolObjects.get("621328a459d5ea634b1246d895f18a7514734467e70df36963177bff69997eb8")
    return getNestedObjectsAsElements(rootProtocolObject, 0, width)
}

function getNestedObjectsAsElements(e, depth, w) {
    var ev = e
    let div = document.createElement("div")
    width = w - (w / 10) - ((w / 50) * depth)
    width = width + "px"
    div.style.width = width
    div.style.float = "right"
    div.append(protocolObject(ev))
    div.style.borderLeftStyle = "dotted";
    div.style.borderLeftWidth = "2px";
    div.style.borderLeftColor = getProtocolObjectColour(ev);

    //div.style.backgroundColor = getProtocolObjectColour(ev);
    //div.style.marginRight = 10 + "px"
    //div.className = "message " + getProtocolObjectColour(ev);
    //console.log(getProtocolObjectColour(ev))
    depth++
    getNestedIds(ev).forEach(function (itemID) {
        div.appendChild(getNestedObjectsAsElements(protocolObjects.get(itemID), depth, w))
    })
    // for (const nestid in getNestedIds(e)) {
    //     console.log(nestid)
    //     console.log(protocolObjects.get(nestid))
    // }
    return div
}


function getMindmachineUID(e) {
    let uid = ""
    e.tags.forEach(function (item) {
        if (item[0] === "mindmachineUID") {
            uid = item[1]
        }
    })
    if (uid.length > 0) {
        return uid
    }
    return "mindmachine_UID_not_found"
}

function getClaimedBy(e) {
    let uid = ""
    e.tags.forEach(function (item) {
        if (item[0] === "claimed_by") {
            uid = item[1]
        }
    })
    if (uid.length === 64) {
        return uid
    }
    return ""
}

function getTitle(e) {
    let title = ""
    e.tags.forEach(function (item) {
        if (item[0] === "title") {
            title = item[1]
        }
    })
    if (title.length > 0) {
        return title
    }
    return ""
}

function getSequence(e) {
    let seq = 0
    e.tags.forEach(function (item) {
        if (item[0] === "sequence") {
            seq = item[1]
        }
    })
    return seq
}

function getProtocolObjectColour(e) {
    let objType = e.tags[0][1];
    switch (objType) {
        case objType = "Definition": {
            return "hsl(207, 61%, 53%)"
        }
        case objType = "Goal": {
            return "hsl(229, 53%, 53%)"
        }
        case objType = "Rule": {
            return "hsl(44, 100%, 77%)"
        }
        case objType = "Invariant": {
            return "hsl(348, 86%, 61%)"
        }
        case objType = "Protocol": {
            return "hsl(0, 0%, 21%)"
        }
    }
}

function getTag(name, event) {
    tagContent = ""
    event.tags.forEach(function (tags) {
        if (tags[0] === name) {
            tagContent = tags[1]
        }
    })
    return tagContent
}