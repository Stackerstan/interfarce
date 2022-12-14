function displayExpenses() {
    document.getElementById("maincontent").replaceChildren(prepWindow())
    document.getElementById("heading").innerText = "Expenses"
    document.getElementById("content").appendChild(underConstruction())
    document.getElementById("content").appendChild(renderDoki("665243fa8200ed93a9e1833beff51e244807d9274b5cc70837a6839d3ced1189"))
    //document.getElementById("content").appendChild(renderDoki("cb399f1ec1302f607d683c31a4928bb3ffbf22a68ba3a3a3db96bfc9038db3cb"))
    //document.getElementById("heading").appendChild(spacer())
    //document.getElementById("heading").appendChild(helpButton("58b02c07e1971ad9178293e0c0d39509a715db35ba3a989ed97d25c6f8e9ad07"))

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