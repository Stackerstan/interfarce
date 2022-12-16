function displayDividends() {
    document.getElementById("maincontent").replaceChildren(prepWindow())
    document.getElementById("heading").innerText = "Dividends"
    document.getElementById("content").appendChild(underConstruction())
    document.getElementById("content").appendChild(renderDoki("49d2ba7e8157518ba63a8a7bf1399c03a8bacbc1ac67831fdc873615c6fc0473"))
}