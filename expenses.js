function displayExpenses() {
    waitForDokiReady(function () {
        document.getElementById("maincontent").replaceChildren(prepWindow())
        document.getElementById("heading").innerText = "Expenses"
        document.getElementById("content").appendChild(displayExistingExpenses())//renderDoki("665243fa8200ed93a9e1833beff51e244807d9274b5cc70837a6839d3ced1189"))
        document.getElementById("details").replaceChildren(newExpenseForm(), renderDoki("bbc8bd7c327140cfd957cecaf139d646f822cc74a69f57eea5392c69a4fd905b"))
        rewriteURL("expenses")
    })
}

function displayExistingExpenses() {
    outer = document.createElement("div")
    tabs = document.createElement("div")
    tabs.className = "tabs is-centered"
    ul = document.createElement("ul")
    inner = document.createElement("div")
    inner.id = "tab_inner"
    let n = makeLi("New", getNumberOfExpenses("new"), function () {
        inner.replaceChildren(getTabInner("new"))
        n.className = "is-active"
        a.className = ""
        r.className = ""
    })
    n.className = "is-active"
    ul.appendChild(n)
    inner.replaceChildren(getTabInner("new"))
    let a = makeLi("Approved", getNumberOfExpenses("approved"), function () {
        inner.replaceChildren(getTabInner("approved"))
        a.className = "is-active"
        n.className = ""
        r.className = ""
    })
    ul.appendChild(a)
    let r = makeLi("Rejected", getNumberOfExpenses("rejected"), function () {
        inner.replaceChildren(getTabInner("rejected"))
        r.className = "is-active"
        n.className = ""
        a.className = ""
    })
    ul.appendChild(r)
    tabs.appendChild(ul)
    outer.appendChild(tabs)
    outer.appendChild(inner)
    return outer
}

function getTabInner(type) {
   let outer = document.createElement("div")
    sharesObjects.forEach(function (v, k) {
        if (v["Expenses"]) {
            v["Expenses"].forEach(function (x) {
                if (type === "approved") {
                    if (x.Approved) {
                        outer.appendChild(createExpenseItemRenderer(x, k))
                    }
                }
                if (type === "rejected") {
                    if (x.Rejected) {
                        outer.appendChild(createExpenseItemRenderer(x, k))
                    }
                }
                if (type === "new") {
                    if (!x.Approved && !x.Rejected) {
                        outer.appendChild(createExpenseItemRenderer(x, k))
                    }
                }
            })
        }
    })
    return outer
}

function getNumberOfExpenses(type) {
    let number = 0
    sharesObjects.forEach(function (v, k) {
        if (v["Expenses"]) {
            v["Expenses"].forEach(function (x) {
                if (type === "approved") {
                    if (x.Approved) {
                        number++
                    }
                }
                if (type === "rejected") {
                    if (x.Rejected) {
                        number++
                    }
                }
                if (type === "new") {
                    console.log(type)
                    if (!x.Approved && !x.Rejected) {
                        number++
                    }
                }
            })
        }
    })
    return number
}


function createExpenseItemRenderer(expense, account) {
    let a = identityObjects.get(account)

    box = document.createElement("article")
    box.className = "message is-primary"
    header = document.createElement("div")
    header.className = "message-header"
    heading = document.createElement("p")
    heading.innerText = a.Name + " requests " + expense.Amount + " sats"
    let cuckbucks = 0
    if (USD) {
        cuckbucks = ((expense.Amount/100000000)*USD).toFixed(2)
        heading.innerText = heading.innerText + " [Cuckbucks:  $" + cuckbucks + "]"
    }
    header.appendChild(heading)
    box.appendChild(header)
    body = document.createElement("div")
    body.className = "message-body"
    ePr = makeParagraph("**Commit/Patch**: [GitHub](" + expense.PullRequest+")")
    eCommit = makeParagraph("**Commit Message:** `"+expense.CommitMsg+"`")
    eSolution = makeParagraph("**SHA256(Patch):** `" + expense.Solution+"`")
    eAmount = makeParagraph("**Amount being claimed:** "+ expense.Amount + " sats (approximately $"+ cuckbucks+" in cuckbucks today)")
    eRatBlack = makeParagraph("**Ratified Votepower**: " + expense.RatifyPermille + "   \n **Blackball Votepower:** " + expense.BlackballPermille)
    depth = currentStatus.Height-expense.WitnessedAt
    eDepth = makeParagraph("**Depth:** " + depth + " Bitcoin blocks")

    body.appendChild(ePr)
    body.appendChild(eCommit)
    body.appendChild(eSolution)
    body.appendChild(eAmount)
    body.appendChild(eDepth)
    body.appendChild(eRatBlack)

    body.appendChild(makeVotingButtons(expense.UID, account))
    box.appendChild(body)

    //todo: voting buttons, comments, allow creator to edit
    return box
}

function makeVotingButtons(UID, account) {
    ratify = document.createElement("button")
    ratify.onclick = onclick
    ratify.className = "button is-success"
    ratify.innerHTML = "<span class=\"icon\"><i class=\"fas fa-check\"></i></span><span>Ratify</span>"
    ratify.onclick = function () {
        if (doIhaveVotepower()) {
            sendExpenseVote(account, UID, 1)
        } else {
            alert("you must have votepower to ratify an expense")
        }
    }
    blackball = document.createElement("button")
    blackball.onclick = function () {
        if (doIhaveVotepower()) {
            sendExpenseVote(account, UID, 0)
        } else {
            alert("you must have votepower to blackball an expense")
        }
    }

    blackball.className = "button is-danger"
    blackball.innerHTML = "<span class=\"icon\"><i class=\"fas fa-times\"></i></span><span>Blackball</span>"
    //blackball.innerText = "Blackball"

    buttons = document.createElement("div")
    buttons.className = "field is-grouped"

    control = document.createElement("div")
    control.className = "control"

    control.appendChild(ratify)
    control.appendChild(spacer())
    control.appendChild(spacer())
    control.appendChild(blackball)
    buttons.appendChild(control)
    return buttons
}

function sendExpenseVote(account, uid, action) {
    sequence = 0
    if (sharesObjects.get(storedPubkey) !== undefined) {
        sequence = sharesObjects.get(storedPubkey).Sequence
    }
    sequence++
    let ratify = false
    let blackball = false
    if (action === 0) {
        blackball = true
    }
    if (action === 1) {
        ratify = true
    }
    content = JSON.stringify({account: account, uid: uid, ratify: ratify, blackball: blackball, sequence: sequence})
    sendEventToMindmachine(content, "", 640206, storedPubkey).then(x =>{
        location.reload()
    })

}

function doIhaveVotepower() {
    let myShares = sharesObjects.get(storedPubkey)
    if (myShares) {
        if (myShares.LeadTimeLockedShares) {
            if (myShares.LeadTime) {
                return true
            }
        }
    }
    return false
}

function renderComments(UID) {

}

function makeLi(name, number, onclick) {
    li = document.createElement("li")
    a = document.createElement("a")
    a.innerText = name + " [" + number + "]"
    a.onclick = onclick
    li.appendChild(a)
    li.id = "li_" + name
    return li
}


var USD = 0

function prices() {
    let request = new XMLHttpRequest()
    request.open("GET","https://blockchain.info/ticker");
    request.send();request.onload = () => {if(request.status === 200){
        data = JSON.parse(request.response)
        price = data["USD"]["15m"]
        if (price) {
            USD = price
            console.log("got USD price")
        }
    } else {
        console.log("Could not get current Bitcoin price in cuck bucks")// if link is broken, output will be page not found
    }
    }
}

function newExpenseForm() {
    div = document.createElement("div")
    div.appendChild(makeH3("Submit a new expense"))
    div.appendChild(makeParagraph("Participants who have contributed code to Stackerstan MAY claim an Expense."))
    div.appendChild(makeTextInput("Link to merged commit", "A link to the commit you are claiming against", "pr input", 64, ""))
    div.appendChild(makeTextInput("Problem", "ID of problem from the Stackerstan Problem Tracker (optional for now)", "problem input", 64, ""))
    div.appendChild(makeTextInput("Commit Message", "The commit message from the Patch Chain or Github", "commit input", 80, ""))
    div.appendChild(makeTextInput("Hash of Merged Patch", "SHA256 digest of the diff that was merged (see instructions below)", "solution input", 64, "")) //todo validate unique
    div.appendChild(makeTextInput("Amount", "Amount you want to claim, in sats", "amount input", 10, ""))
    div.appendChild(expenseButtons(function () {
        amount = parseInt(document.getElementById("amount input").value, 10)
        problem = document.getElementById("problem input").value
        commit = document.getElementById("commit input").value
        solution = document.getElementById("solution input").value
        pr = document.getElementById("pr input").value
        if (amount) {
            if (solution.length === 64) {
                if (commit.length > 0) {
                    if (pr.length > 30 && pr.length < 200) {
                        if (problem.length > 0 && problem.length !== 64) {
                            alert("invalid problem ID, must be ID from the issue tracker, or must be empty")
                        } else {
                            if (accountIsInIdentityTree(storedPubkey)) {
                                sendExpense(amount, solution, commit, pr, problem)
                            } else {
                                alert("you must be in the Identity Tree to submit an expense")
                            }
                        }
                    } else {
                        alert("is that a valid link to a pull request on one of the stackerstan repos?")
                    }
                } else {
                    alert("what is the commit message?")
                }
            } else {
                alert("invalid solution, must be hash of a patch")
            }
        } else {
            alert("invalid amount")
        }
    }))
    div.appendChild(document.createElement("br"))
    return div
}

function sendExpense(amount, solution, commitmsg, pr, problem) {
        sequence = 0
        if (sharesObjects.get(storedPubkey) !== undefined) {
            sequence = sharesObjects.get(storedPubkey).Sequence
        }
        sequence++
        content = JSON.stringify({pullrequest: pr, problem: problem, commitmsg: commitmsg, solution: solution, amount: amount, sequence: sequence})
        sendEventToMindmachine(content, "", 640204, storedPubkey).then(x =>{
            location.reload()
        })

}

function expenseButtons(onclick) {
    submit = document.createElement("button")
    submit.onclick = onclick
    submit.className = "button is-link"
    submit.innerText = "Submit"
    cancel = document.createElement("button")
    cancel.onclick = function () {
        document.getElementById('problem input').value = '';
        document.getElementById('commit input').value = '';
        document.getElementById('solution input').value = '';
        document.getElementById('amount input').value = '';
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
