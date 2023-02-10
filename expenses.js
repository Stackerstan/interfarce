function displayExpenses() {
    waitForDokiReady(function () {
        document.getElementById("maincontent").replaceChildren(prepWindow())
        document.getElementById("heading").innerText = "Expenses"
        document.getElementById("content").appendChild(renderDoki("665243fa8200ed93a9e1833beff51e244807d9274b5cc70837a6839d3ced1189"))
        document.getElementById("details").replaceChildren(newExpenseForm())
        rewriteURL("expenses")
    })
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
    div.appendChild(makeTextInput("Problem", "ID of problem from problem tracker (optional)", "problem input", 64, ""))
    div.appendChild(makeTextInput("Commit Message", "The commit message from the Patch Chain or Github", "commit input", 80, ""))
    div.appendChild(makeTextInput("Patch", "Sha256 of the diff that was merged (see instructions below)", "solution input", 64, ""))
    div.appendChild(makeTextInput("Amount", "Amount you want to claim, in sats", "amount input", 10, "")) //todo add usd conversion/indication
    div.appendChild(expenseButtons(function () {
        amount = parseInt(document.getElementById("amount input").value, 10)
        problem = document.getElementById("problem input").value
        commit = document.getElementById("commit input").value
        solution = document.getElementById("solution input").value
        if (amount) {
            if (solution.length === 64) {
                if (commit.length > 0) {
                    if (problem.length > 0 && problem.length !== 64) {
                        alert("invalid problem ID, must be ID from the issue tracker, or must be empty")
                    } else {
                      sendExpense(amount, solution, commit, problem)
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
    return div
}

function sendExpense(amount, solution, commitmsg, problem) {
        sequence = 0
        if (sharesObjects.get(storedPubkey) !== undefined) {
            sequence = sharesObjects.get(storedPubkey).Sequence
        }
        sequence++
    // Problem   string //ID of problem from problem tracker (optional)
// CommitMsg string //<81 chars
// Solution  string //hash of diff
// Amount    int64  //amount being claimed in satoshi
// Sequence  int64
        content = JSON.stringify({problem: problem, commitmsg: commitmsg, solution: solution, amount: amount, sequence: sequence})
    console.log(content)
        sendEventToMindmachine(content, "", 640204, storedPubkey).then(x =>{
            //if (reload) {location.reload()}
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