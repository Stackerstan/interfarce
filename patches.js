const patchMap = new Map();

function displayPatches() {
    document.getElementById("maincontent").replaceChildren(prepWindow())
    document.getElementById("heading").innerText = "Patch Chain"
    document.getElementById("heading").appendChild(spacer())
    document.getElementById("heading").appendChild(helpButton("7867490001e7dcd0e96b53446c9dbfb4f73d6efa2b89ce20880e684a545a5f84"))
    // document.getElementById("content").replaceChildren(loadingSign())
    // waitForProtocolReady(function () {
    //     document.getElementById("content").replaceChildren(renderProtocol())
    // })
    cont = document.getElementById("content")
    patchMap.forEach(function (patch) {
        cont.appendChild(renderPatch(patch))
    })
    //document.getElementById("content").replaceChildren(renderProtocolObjects(document.getElementById("content").clientWidth))
    document.getElementById("details").replaceChildren(howTo(), displayPatchTools(), newRepoForm())
    rewriteURL("patches")
}

function howTo() {
    let p0 = "#### How to send a Patch the easy way \nHead over to the [Github organisation](https://github.com/Stackerstan) and follow the step-by-step instructions. Pull requests that are merged into master can then be pushed into the Patch Chain by you or a [Maintainer](superprotocolo://c4b014e8d2c1c6769ac45dc6a27e28048f6b89edfe49b9f4434ba3216cf9451d)."
    //let c = "#### How to build and run \n1. Download the latest Mindmachine tip from below or the [github mirror](https://github.com/Stackerstan/mindmachine) \n2. `make run` and wait for it to reach the current Bitcoin height\n3. Clone the [interfarce](https://github.com/Stackerstan/interfarce) and replace  .\n4. If something goes wrong: `make reset`\n"
    let p = "#### How to send a Patch the difficult way \nThis is clunky and buggy because Stackerstan doesn't use Git and instead uses it's own built-in and very pre-alpha Version Control System called the Patch Chain, which is included in OP_RETURN states.\n\n1. Edit `cliListener.go` \n\n---\n2. Find \"o\" and replace the hash with the UID of a Problem you have Claimed\n\n---\n3. Press \"o\" in the CLI.\n\n A working directory will be printed in the CLI, open it in your favourite IDE.\n\n---\n4. Solve the Problem with the least amount of changes possible but leave anything you modify *easier to reason about than before you started touching it*.\n\n---\n5. Run `make reset` to sync with the network and make sure your changes didn't break anything.\n\n---\n6. Edit `cliListener.go` again and find \"l\". \n\n    Replace the hash with the UID of the problem you are solving.\n\n---\n7. **Backup your modifications**, the next step is buggy and you might be about to lose them all.\n\n---\n8. Put your seatbelt on, make sure it's tight and secure. If you're fat you'll probably want a full harness.\n\n Press \"l\" in the CLI and save the output that's printed so that you can figure out what's broken.\n\n If it worked (20% chance), you'll see your Patch in the Interfarce ready to be Merged by a Maintainer. If it didn't, there's a bug and you'll probably want to ask for help in the Samizdatree or something."
    md = new showdown.Converter({
        extensions: [...bindings]
    })
    ht = md.makeHtml(p0)
    ht2 = md.makeHtml(p)
    mdht = document.createElement("div")
    mdht.innerHTML = ht
    mdht.className = "content"
    mdht2 = document.createElement("div")
    mdht2.innerHTML = ht2
    mdht2.className = "content"
    box = document.createElement("div")
    box.appendChild(mdht)
    box.appendChild(mdht2)
    return box
}

function renderPatch(patch) {
    deets = document.createElement("div")
    deets.className = "content is-primary"
    deets.appendChild(createElement("Repo", patch.RepoName))
    deets.appendChild(createElement("Created By", patch.CreatedBy))
    deets.appendChild(createElement("Created At", patch.CreatedAt))
    deets.appendChild(createElement("Conflicts", patch.Conflicts))
    deets.appendChild(createElement("Merged", (patch.Maintainer.length === 64) ? "Yes" : "No" ))
    viewbtn = document.createElement("button")
    viewbtn.className = "button is-info"
    viewbtn.innerText = "View Patch"
    viewbtn.onclick = function () {
        downloadPatch(patch.Diff, patch.UID)
    }
    mergebtn = document.createElement("button")
    mergebtn.className = "button is-primary"
    mergebtn.innerText = "Merge Patch"
    mergebtn.onclick = function () {
        content = JSON.stringify({
            RepoName: patch.RepoName,
            UID: patch.UID,
            Conflicts: false,
            Height: currentStatus.Height,
            Sequence: patch.Sequence + 1
        })
        sendMerge(content)
    }
    deets.appendChild(viewbtn)
    deets.appendChild(mergebtn)
    return deets
}

function sendMerge(content) {
        if (identityObjects.get(storedPubkey).GlobalSequence !== undefined) {
        p = makeEvent(content, "", 641004)
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

function downloadPatch(diff, id) {
    var a = window.document.createElement('a');

    a.href = window.URL.createObjectURL(new Blob([diff], {type: 'text/plain;charset=utf-8'}));
    a.download = id + ".patch";

    // Append anchor to body.
    document.body.appendChild(a)
    a.click();

    // Remove anchor from body
    document.body.removeChild(a)
}

function enMapPatch(e) {
    p = JSON.parse(e.content)
    patchMap.set(e.id, p)
}

function downloadLatest(hex) {
    var upper_hex = hex.toUpperCase()
    var filename = "latest.tar.gz";
    if (upper_hex.length % 2) {
        alert("Error: cleaned hex string length is odd.");
        return;
    }
    var binary = [];
    for (var i = 0; i < upper_hex.length / 2; i++) {
        var h = upper_hex.substr(i * 2, 2);
        binary[i] = parseInt(h, 16);
    }

    var byteArray = new Uint8Array(binary);
    var a = window.document.createElement('a');

    a.href = window.URL.createObjectURL(new Blob([byteArray], {type: 'application/octet-stream'}));
    a.download = filename;

    // Append anchor to body.
    document.body.appendChild(a)
    a.click();

    // Remove anchor from body
    document.body.removeChild(a)
}

function displayPatchTools() {
    div = document.createElement("div")
    div.className = "content"
    fetchButton = document.createElement("button")
    fetchButton.innerText = "Fetch latest Mindmachine tip"
    fetchButton.onclick = function () {
        //fetchMindmachineTip()
    }
    fetchButton.className = "button is-static"
    div.appendChild(fetchButton)


    return div
}

// function addRepo( name) {
//     var now = Math.floor( ( new Date().getTime() ) / 1000 );
//     content = name
//     var newevent = [
//         0,
//         storedPubkey,
//         now,
//         641000,
//         [],
//         content
//     ];
//     var message = JSON.stringify( newevent );
//     console.log( "message: '" + message + "'" );
//     var msghash = bitcoinjs.crypto.sha256( message ).toString( 'hex' );
//     console.log( "msghash: '" + msghash + "'" );
//     nobleSecp256k1.schnorr.sign( msghash, privKey ).then(
//         value => {
//             sig = value;
//             console.log( "the sig is:", sig );
//             nobleSecp256k1.schnorr.verify(
//                 sig,
//                 msghash,
//                 storedPubkey
//             ).then(
//                 value => {
//                     if ( value ) {
//                         var fullevent = {
//                             "id": msghash,
//                             "pubkey": storedPubkey,
//                             "created_at": now,
//                             "kind": 641000,
//                             "tags": [],
//                             "content": content,
//                             "sig": sig
//                         }
//                         var sendable = [ "EVENT", fullevent ];
//                         sessionStorage.sendable = JSON.stringify( sendable );
//                         mindmachineSocket.send( '["EVENT",' + JSON.stringify( JSON.parse( sessionStorage.sendable )[ 1 ] ) + ']' );
//                     }
//                 }
//             );
//         }
//     );
// }

function newRepoForm() {
    let div = document.createElement("div")
    let repoName = document.createElement("input")
    repoName.type = "text"
    repoName.placeholder = "Repo Name"
    repoName.className = "input is-primary"

    let problemID = document.createElement("input")
    problemID.type = "text"
    problemID.placeholder = "Problem ID"
    problemID.className = "input is-primary"

    let submitbtn = document.createElement("button")
    submitbtn.textContent = "Create New Repository"
    submitbtn.className = "button is-primary"
    submitbtn.onclick = function () {
        addRepo(problemID.value, repoName.value)
        problemID.value = ""
        repoName.value = ""
    }
    div.appendChild(repoName)
    div.appendChild(problemID)
    div.appendChild(submitbtn)
    return div
}

async function addRepo(problemID, name) {
    // if (parentID.length === 64) {
    content = JSON.stringify({
        problem: problemID,
        name: name,
    })
    p = makeEvent(content, "", 641000)
    signHash(p.id).then(
        function (result) {
            p.sig = result
            sendIt(p)
            console.log(p)
            location.reload()
        }
    )
}

// async function addRepo(problemID, name) {
//     var now = Math.floor( ( new Date().getTime() ) / 1000 );
//     // tags = []
//     // if (etag !== undefined) {
//     //     if (etag.length > 0) {
//     //         tags.push(["e", etag])
//     //     }
//     // }
//     // if (kind !== 1) {
//     //     if (identityObjects.get(storedPubkey).Sequence !== undefined) {
//     //         sequence = identityObjects.get(storedPubkey).Sequence+1
//     //         tags.push(["sequence", sequence.toString()])
//     //     }
//     // }
//     k = 641000
//     pubkey = await window.nostr.getPublicKey()
//     var newevent = [
//         0,
//         pubkey,
//         now,
//         k,
//         tags,
//         JSON.stringify(name)
//     ];
//     e =  window.nostr.signEvent(newevent)
//     console.log(e)
//     console.log(newevent)
// }