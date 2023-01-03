function displayExpenses() {
    waitForDokiReady(function () {
        document.getElementById("maincontent").replaceChildren(prepWindow())
        document.getElementById("heading").innerText = "Expenses"
        // document.getElementById("content").appendChild(underConstruction())
        // document.getElementById("content").appendChild(renderDoki("665243fa8200ed93a9e1833beff51e244807d9274b5cc70837a6839d3ced1189"))
        document.getElementById("maincontent").replaceChildren(prepWindow())
        // document.getElementById("heading").innerText = "Problem Tracker"
        document.getElementById("content").replaceChildren( loadingSign())
        waitForProblemsReady(function () {
            document.getElementById("content").replaceChildren(renderProblemsTitle())
        })
        document.getElementById("details").replaceChildren()
        rewriteURL("expenses")
    })
}
function renderProblemsTitle() {
    let div = document.createElement("div")
    let rootProblems = getOrderedRootProblems();
    rootProblems.forEach(function (item) {
        div.appendChild(renderChildren(item))
    })

    return div
}

function renderChildren(item) {
    let div = document.createElement("div")
    div.appendChild(renderProblemTitle(item))
    getChildren(item.mindmachineUID).forEach(function (child) {
        //div.firstChild.childNodes[1].appendChild(renderProblem(child))
        div.firstChild.childNodes[1].appendChild(renderChildren(child))
    })
    return div
}
function renderProblemTitle(item,collapse=true) {
    
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
        showDetailsExpense(item)

        // if(document.getElementById(`childrenof` + item.mindmachineUID).firstChild.style.display=='block'){
                 
        //             document.getElementById(`childrenof` + item.mindmachineUID).firstChild.style.display='none'
                  
                      
        // } else {
        //     document.getElementById(`childrenof` + item.mindmachineUID).firstElementChild.style.display='block'
        // }      
    }
    desc_ = document.createElement("div")
    desc_.className = "message-body";
    article.appendChild(desc)
    return article
}


function showDetailsExpense(event) {
    document.getElementById("details").replaceChildren()
    document.getElementById("details").appendChild(renderProblem(event,false))
    if (event.kind === 640899) {
        let claim_div = document.createElement("div")
        let claim_btn = document.createElement("button")
        claim_btn.innerText = "Create Expense"
        claim_btn.className = "button is-primary"
        claim_btn.onclick = function () {
            if (!accountIsInIdentityTree(pubKeyMinus2)) {
                alert("You must be in the Identity Tree to do that")
            } else {
                
                document.getElementById("details").appendChild(editExpenseForm(event))
                
                // content = JSON.stringify({"problem": event.mindmachineUID, "solution": true,"amount":1, "sequence": seq})
                // claim_event = makeEvent(content, event.mindmachineUID, 640204)
                // signHash(claim_event.id).then(
                //     function (result) {
                //         claim_event.sig = result
                //         sendIt(claim_event)
                //         console.log(claim_event)
                //         location.reload()
                //     }
                // )
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
function positiveInteger(obj) {
	// 当数值长度大于等于2时，第一位不能为0
	obj.value = obj.value.replace(/^([1-9]\d*(\.[\d]{0,2})?|0(\.[\d]{0,2})?)[\d.]*/g, "$1");
	// 输入0-9的整数，其他的除外
	obj.value = obj.value.replace(/[^0-9]/g, '');

	document.getElementById('idBox').innerText = obj.value;
}

function editExpenseForm(item,seq) {
    console.log(item,"c")
    let div =document.createElement("div")
    let title = document.createElement("input")
    title.type = "text"
    title.placeholder = "Expenses Amount"
    title.className = "input is-link"
    title.oninput = "positiveInteger(this)"
    let textbox = document.createElement("textarea")
    textbox.className = "textarea"
    textbox.placeholder = "Patch ID"
    textbox.id = "reply"
    let submitbtn = document.createElement("button")
    submitbtn.textContent = "Submit Expense"
    submitbtn.className = "button is-primary"
    seq = Number(getSequence(item))
    
    submitbtn.onclick = function () {
        createNewExpense(title.value, textbox.value, item.mindmachineUID,seq)
        textbox.value = ""
        title.value = ""
    }
    div.appendChild(title)
    div.appendChild(textbox)
    div.appendChild(submitbtn)

    return div
}

function createNewExpense(amount, solution, problem,seq) {
    if ((amount > 0) && (solution.length > 0)) {
        // var oReq = new XMLHttpRequest();
        // oReq.addEventListener("load", reqListener);
        // oReq.open("GET", solution);
        // console.log(oReq,"d")
        var solutionHash= bitcoinjs.crypto.sha256(solution).toString('hex');
        content = JSON.stringify({
            Amount:amount,
            Solution:solutionHash,
            Problem:problem,
            Sequence:seq+1
        })
        
        p = makeEvent(content, "", 640204)
        signHash(p.id).then(
            function (result) {
                p.sig = result
                sendIt(p)
                console.log(p,"d")
                // location.reload()
            }
        )
    }
    }



function underConstruction() {
    box = document.createElement("div")
    box.className = "content"
    box.appendChild(gifabricante("mamagnolia_acresunderconstruction.gif"))
    box.appendChild(document.createElement("br"))
    // box.appendChild(gifabricante("HeHeartlandRanch7219underconstruction.gif"))
    // box.appendChild(gifabricante("HeHeartlandGarden5828constructionuc3.gif"))
    // box.appendChild(gifabricante("HeHeartlandGarden5828constructionuc3.gif"))
    // box.appendChild(gifabricante("HeHeartlandRanch7219underconstruction.gif"))
    // box.appendChild(document.createElement("br"))
    // box.appendChild(gifabricante("mamagnolia_acresunderconstruction.gif"))
    // document.getElementById("content").replaceChildren(box)
    return box
}

function gifabricante(filenome) {
    gif = document.createElement("img")
    gif.src = filenome
    return gif
}

