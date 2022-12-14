function displayRankings() {
    document.getElementById("maincontent").replaceChildren(prepWindow())
    document.getElementById("heading").innerText = "Nostranker: Highest Signal to Noise, Ever."
    document.getElementById("content").appendChild(underConstruction())
    document.getElementById("content").appendChild(renderDoki("531d9cbe7844937492bea59f7fa7f131f7ad120ae534c579f49df3c30b3cc336"))
    //document.getElementById("content").appendChild(renderDoki("cb399f1ec1302f607d683c31a4928bb3ffbf22a68ba3a3a3db96bfc9038db3cb"))
    //document.getElementById("heading").appendChild(spacer())
    //document.getElementById("heading").appendChild(helpButton("58b02c07e1971ad9178293e0c0d39509a715db35ba3a989ed97d25c6f8e9ad07"))

}