function displayExpenses() {
    waitForDokiReady(function () {
        document.getElementById("maincontent").replaceChildren(prepWindow())
        document.getElementById("heading").innerText = "Expenses"
        document.getElementById("content").appendChild(underConstruction())
        document.getElementById("content").appendChild(renderDoki("665243fa8200ed93a9e1833beff51e244807d9274b5cc70837a6839d3ced1189"))
        rewriteURL("expenses")
    })
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