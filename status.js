function displayStatus() {
    document.getElementById("maincontent").replaceChildren(prepWindow())
    document.getElementById("heading").innerText = "Current Mindmachine Status"
    document.getElementById("content").replaceChildren(loadingSign())
    waitForDokiReady(function () {
        waitForStatusReady(function () {
            rewriteURL("home")
            document.getElementById("content").replaceChildren(renderStatus())
            document.getElementById("details").append(renderDoki("cb399f1ec1302f607d683c31a4928bb3ffbf22a68ba3a3a3db96bfc9038db3cb"), renderDoki("9827d8ede1572958ef01b67aee20618be038af2976b9aee0b175c3624e93b997"))
        })
    })
}

var statusready = false

function waitForStatusReady(callback) {
    var interval = setInterval(function() {
        if (statusready) {
            clearInterval(interval);
            callback();
        }
    }, 200);
}

function renderStatus() {
    deets = document.createElement("div")
    deets.className = "content"
    deets.appendChild(createElement("Mindmachine's Current Bitcoin Block Height", currentStatus.Height))
    deets.appendChild(createElement("Number of Participants", currentStatus.Participants))
    deets.appendChild(createElement("Number of Maintainers", currentStatus.Maintainers))
    deets.appendChild(createElement("Latest OP_RETURN State", currentStatus.OpReturn))
    let shareholders = createElement()
    //shareholders.appendChild(createElement("Total Value of Approved Expenses", approvedExenses()))
    shareholders.appendChild(makeParagraph("#### Stackerstan Cap Table\nTotal Value of Approved Expenses: " + approvedExenses() + "   \n" + "Total Shares in Stackerstan: " + currentStatus.Shares.toLocaleString()))
    //shareholders.appendChild(makeParagraph("**Total Shares in Stackerstan:** " + currentStatus.Shares.toLocaleString()))
    //shareholders.appendChild(createElement("Total Shares in Stackerstan", currentStatus.Shares.toLocaleString()))
    //shareholders.appendChild(createElement("Total number of Shareholders: ", currentStatus.Shareholders))
    shareholders.appendChild(makeParagraph("##### Share Creation Over Time\n(Shares are created when an Expense is approved)"))
    shareholders.appendChild(renderSharesOverTime())
    shareholders.appendChild(makeParagraph("##### Share Distribution at Block " + currentStatus.Height))
    shareholders.appendChild(renderShareholderChart())
    shareholders.appendChild(makeParagraph("   \n\n##### Voting Power at Block " + currentStatus.Height + "\n(Voting Power is the Participant's Lead Time multiplied by their Shares)"))
    shareholders.appendChild(renderVotepowerChart())
    deets.appendChild(shareholders)
    //deets.appendChild(renderChart())
    //deets.appendChild(createElement("Total Votepower in Stackerstan", currentStatus.Votepower))


    return deets
}

function renderSharesOverTime() {
    let blocks = [];
    let shares = [];


let sharesInBlock = new Map;
    for (let i = 777700; i < currentStatus.Height+1; i++) {
        blocks.push(i)
        if (sharesInBlock.get(i-1)) {
            sharesInBlock.set(i, sharesInBlock.get(i-1))
        } else {
            sharesInBlock.set(i, 1)
        }

        sharesObjects.forEach(function (v, k) {
            if (v.Expenses) {
                v.Expenses.forEach(function (e) {
                    if (e.Approved) {
                        if (e.WitnessedAt === i) {
                            sharesInBlock.set(i, sharesInBlock.get(i)+e.Amount)
                        }
                    }
                })
            }
        })
    }

    sharesInBlock.forEach(function (value) {
        shares.push(value)
    })
    console.log(blocks)
    console.log(shares)
    let b = document.createElement("canvas")
    new Chart(b, {
        type: 'line',
        data: {
            labels: blocks,
            datasets: [{
                label: "Total Stackerstan Shares",
                data: shares,
                borderWidth: 1
            }]
        },
        options: {
        }
    });
    console.log(b)
    let box = document.createElement("div")
    box.appendChild(b)
    box.appendChild(document.createElement("br"))
    return box
}


// function renderSharesOverTime() {
//     let blocks = [];
//     let shares = new Map;
//     let totalSharesPerAccount = new Map;
//     let totalShares = 1
//     sharesObjects.forEach(function (v, k) {
//         if (v.Expenses) {
//             shares.set(k, [])
//             totalSharesPerAccount.set(k, 0)
//             v.Expenses.forEach(function (e) {
//                 if (e.Approved) {
//                     let toPush = {}
//                     toPush.Height = e.WitnessedAt
//                     let sum = totalSharesPerAccount.get(k)
//                     toPush.Amount = e.Amount + sum
//                     totalSharesPerAccount.set(k, toPush.Amount)
//                     let current = shares.get(k)
//                     current.push(toPush)
//                     shares.set(k, current)
//                 }
//             })
//         }
//     })
//
//     let totalSharesToRender = new Map;
//     shares.forEach(function (v, k) {
//         totalSharesToRender.set(k, [])
//     })
//     for (let i = 761151; i < currentStatus.Height+1; i++) {
//         blocks.push(i)
//         shares.forEach(function (v, k) {
//             v.forEach(function (v2) {
//                 if (v2.Height === i) {
//                     toPush = totalSharesToRender.get(k)
//                     toPush.push(v2.Amount)
//                     totalSharesToRender.set(k, toPush)
//                     let total = v2.Amount
//                 }
//             })
//         })
//     }
//     console.log(blocks)
//     console.log(shares)
//     console.log(totalSharesPerAccount)
// }

function renderShareholderChart() {
    let shareholders = []
    let shares = []
    sharesObjects.forEach(function (v, k) {
        if (v.LeadTimeLockedShares || v.LeadTimeUnlockedShares) {
            let total = v.LeadTimeLockedShares + v.LeadTimeUnlockedShares
            shareholders.push(identityObjects.get(k).Name + "["+total+"]")
            shares.push(total)
        }
    })
    let b = document.createElement("canvas")
    new Chart(b, {
        type: 'doughnut',
        data: {
            labels: shareholders,
            datasets: [{
                data: shares,
                borderWidth: 1,
            }]
        },
        options: {
        }
    });
    console.log(b)
    let box = document.createElement("div")
    box.innerHTML = b
    return b
}

function renderVotepowerChart() {
    let shareholders = []
    let shares = []
    sharesObjects.forEach(function (v, k) {
        if (v.LeadTimeLockedShares || v.LeadTimeUnlockedShares) {
            let total = v.LeadTimeLockedShares * v.LeadTime
            shareholders.push(identityObjects.get(k).Name + "["+total+"]")
            shares.push(total)
        }
    })
    let b = document.createElement("canvas")
    new Chart(b, {
        type: 'doughnut',
        data: {
            labels: shareholders,
            datasets: [{
                data: shares,
                borderWidth: 1,
            }]
        },
        options: {
        }
    });
    console.log(b)
    let box = document.createElement("div")
    box.innerHTML = b
    return b
}

function approvedExenses() {
    let val = 0
    sharesObjects.forEach(function (v) {
        if (v.Expenses) {
            v.Expenses.forEach(function (e) {
                if (e.Approved) {
                    val += e.Amount
                }
            })
        }
    })
    return val.toLocaleString() + " sats"
}

function loadingSign() {
    d = document.createElement("div")
    d.className = "content"
    deets = document.createElement("progress")
    deets.className = "progress is-large is-info"
    deets.max = 100
    deets.innerText = "60%"
    i = document.createElement("img")
    i.src = "icon.png"
    d.appendChild(deets)
    d.appendChild(i)
    d.style.width = "75%"
    return d
}