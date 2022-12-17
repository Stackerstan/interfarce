const queryString = window.location.search;
const onloadLocation = window.location;
const urlParams = new URLSearchParams(queryString);
const doki_id = urlParams.get('doki_id')
const profile_id = urlParams.get('profile_id')

function detect_id() {
    console.log(onloadLocation.hash)
    if (onloadLocation.hash !== undefined) {
        switch (onloadLocation.hash){
            case "#status":
                displayStatus()
                return;
            case "#protocol":
                displayProtocol()
                return;
            case "#problems":
                displayProblemTracker()
                return;
            case "#nostr":
                displayNostr()
                return;
            case "#identity_tree":
                displayUshTree()
                return;
            case "#samizdat":
                displaySamizdat()
                return;
            case "#patches":
                displayPatches()
                return;
            case "#doki":
                displayDoki()
                return;
            case "#expenses":
                displayExpenses()
                return;
            case "#dividends":
                displayDividends()
                return;
            case "#nostranker":
                displayRankings()
                return;
        }
    }
    if (doki_id !== null) {
        if (doki_id.length === 64) {
            displaySingleDoki(doki_id)
            return
        }
    }
    if (profile_id !== null) {
        displaySingleProfile(profile_id)
        return
    }

    renderHome()
}

function prepWindow(kind) {
    replacer = document.createElement("div")
    replacer.innerHTML = `
    <div class="columns">
        <div class="column is-half">
        <div class="box">
        <div class="block">
        <div class="content">
        <h3 class="is-3" id="heading"></h3>
        <h6 class="subtitle is-6" id="description"></h6>
</div>
</div>
            <div class="content" id="content"></div>
        </div>
        </div>
        <div class="column is-half">
        <div class="box">
            <div class="content" id="details"></div>
        </div>
        </div>
    </div>
`
    if (kind === "doki_id") {
        replacer.innerHTML = `
    <div class="columns">
        <div class="column is-half">
        <div class="box">
            <div class="content" id="content"></div>
        </div>
        </div>
        <div class="column is-half">
        <div class="box">
            <div class="content" id="details"></div>
        </div>
        </div>
    </div>
`
    }
    return replacer
}

function rewriteURL(page) {
    //setURLID(page, "")
    loc = window.location.href
    loc = loc.split("index.html")
    console.log(loc)
    loc = loc[0] + "index.html"
    loc = loc + "#" + page
    window.history.pushState("", "", loc)
}

function setURLID(type, id) {
    loc = window.location.href
    loc = loc.split("index.html")
    loc = loc[0] + "index.html"
    loc = loc + "?" + type + "=" + id
    window.history.pushState("", "", loc)
    switch (type) {
        case "doki_id":
            displaySingleDoki(id)
            break;
        case "profile_id":
            displaySingleProfile(id)
            break;
        // case "nostr":
        //     displayNostr()
        //     break;
    }
}