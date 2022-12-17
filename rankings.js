function displayRankings() {
    waitForDokiReady(function () {
        document.getElementById("maincontent").replaceChildren(prepWindow())
        document.getElementById("heading").innerText = "Nostranker: Highest Signal to Noise, Ever."
        document.getElementById("content").appendChild(underConstruction())
        document.getElementById("content").appendChild(renderDoki("531d9cbe7844937492bea59f7fa7f131f7ad120ae534c579f49df3c30b3cc336"))
        rewriteURL("nostranker")
    })
}