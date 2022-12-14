function displayStatus() {
    document.getElementById("maincontent").replaceChildren(prepWindow())
    document.getElementById("heading").innerText = "Current Mindmachine Status"
    document.getElementById("content").replaceChildren(loadingSign())
    waitForStatusReady(function () {
        rewriteURL("status")
        document.getElementById("content").replaceChildren(renderStatus())
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
    deets.appendChild(createElement("Bitcoin Block Height", currentStatus.Height))
    deets.appendChild(createElement("Total Shares in Stackerstan", currentStatus.Shares))
    deets.appendChild(createElement("Number of Shareholders", currentStatus.Shareholders))
    deets.appendChild(createElement("Total Votepower in Stackerstan", currentStatus.Votepower))
    deets.appendChild(createElement("Number of Participants", currentStatus.Participants))
    deets.appendChild(createElement("Number of Maintainers", currentStatus.Maintainers))
    deets.appendChild(createElement("Latest OP_RETURN State", currentStatus.OpReturn))
    return deets
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