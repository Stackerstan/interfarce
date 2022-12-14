const dokiObjects = new Map;
let dokiReady = false

function waitForDokiReady(callback) {
    var interval = setInterval(function() {
        if (dokiReady) {
            clearInterval(interval);
            callback();
        }
    }, 200);
}

function enMapDokiObject(e) {
    dokiItem = JSON.parse(e.content)
    dokiObjects.set(dokiItem.UID, dokiItem)
    //console.log(dokiObjects)
}

function displaySingleDoki(id) {
    if ((id !== null) && (id !== undefined)) {
        if (id.length === 64) {
            document.getElementById("maincontent").replaceChildren(prepWindow("doki_id"))
            waitForDokiReady(function () {
                document.getElementById("content").replaceChildren(renderOneDoki(id), renderEditDoki(id))
            })
        }
    }
}

function displayDoki() {
    document.getElementById("maincontent").replaceChildren(prepWindow())
    document.getElementById("heading").innerText = "Doki"
    document.getElementById("description").innerText = "Wiki with Stackerstani characteristics"
    document.getElementById("content").replaceChildren(renderAllDoki())
    rewriteURL("doki")
}

function renderAllDoki() {
    all = document.createElement("div")
    dokiObjects.forEach(function (d) {
        doc = document.createElement("div")
        doc.className = "box"
        doc.innerText = d.GoalOrProblem
        n = document.createElement("nav")
        n.className = "level-item level-right"
        a = document.createElement("a")
        a.onclick = function () {
            setURLID("doki_id", d.UID)
        }
        a.innerText = "VIEW"
        n.appendChild(a)
        doc.appendChild(n)

        all.appendChild(doc)
    })
    all.appendChild(renderDokiNewDocumentForm())
    return all
}

function renderEditDoki(id) {
    form = document.createElement("div")
    ta = document.createElement("textarea")
    ta.rows = 20
    ta.style.width = "100%"
    saz = dokiObjects.get(id)
    ta.textContent = saz.CurrentTip
    ta.onkeyup = function () {
        var dmp = new diff_match_patch()
        d = dmp.diff_main(saz.CurrentTip, ta.value)
        dmp.diff_cleanupSemantic(d)
        document.getElementById("details").innerHTML = dmp.diff_prettyHtml(d)
    }
    submit = document.createElement("button")
    submit.innerText = "Submit"
    submit.onclick = function () {
        patch = makePatch(saz.CurrentTip, ta.value)
        makeAndSendKind641202(saz.UID, patch, "replace with form", saz.Sequence)
    }
    form.appendChild(ta)
    form.appendChild(submit)
    return form
}

function makeAndSendKind641202(document_uid, patch, problem, sequence) {
    content = JSON.stringify({
        document_uid: document_uid,
        patch: patch,
        problem: problem,
        sequence: sequence+1
    })
    p = makeEvent(content, "", 641202)
    signHash(p.id).then(
        function (result) {
            p.sig = result
            sendIt(p)
            console.log(p)
            location.reload()
        }
    )
}

function makePatch(original, modification) {
    var dmp = new diff_match_patch()
    d = dmp.diff_main(original, modification)
    dmp.diff_cleanupSemantic(d)
    //dmp.diff_prettyHtml(d)
   // document.getElementById("details").innerHTML = dmp.diff_prettyHtml(d)
    console.log(d)
    p = dmp.patch_make(saz.CurrentTip, d)
    console.log(p)
    ps = dmp.patch_toText(p)
    return ps
}
const classMap = {
    h1: 'title is-1',
    h2: 'title is-2',
    h3: 'title is-3',
    h4: 'title is-4',
    h6: 'subtitle'
}

const bindings = Object.keys(classMap)
    .map(key => ({
        type: 'output',
        regex: new RegExp(`<${key}(.*)>`, 'g'),
        replace: `<${key} class="${classMap[key]}" $1>`
    }));

function renderOneDoki(id) {
    doc = document.createElement("div")
    doc.className = "content is-medium"
    //doc.className = "box"
    saz = dokiObjects.get(id)
    if (saz !== undefined) {
        goal_or_problem = document.createElement("div")
        goal_or_problem.className = "box"
        goal_or_problem.innerText = saz.GoalOrProblem
        doc.appendChild(goal_or_problem)
        md = new showdown.Converter({
            extensions: [...bindings]
        })
        //console.log(showdown.getDefaultOptions(md))
        ht = md.makeHtml(saz.CurrentTip)
        mdht = document.createElement("div")
        mdht.innerHTML = ht
        doc.appendChild(mdht)
        let rendered = false
        if (saz.Patches !== null) {
            saz.Patches.forEach(function (patch) {
                if ((patch.MergedBy.length !== 64) && (patch.RejectedBy.length !== 64) && !rendered) {
                    var dmp = new diff_match_patch()
                    p = dmp.patch_fromText(patch.Patch)
                    pretty = document.createElement("div")
                    //console.log(p)
                    p.forEach(function (data) {
                        pretty.innerHTML  += dmp.diff_prettyHtml(data.diffs)
                        pretty.innerHTML  += '<br /><br />'
                    })
                    mrg = document.createElement("button")
                    mrg.innerText = "Merge"
                    mrg.onclick = function () {
                        makeAndSendKind641204(id, patch.EventID, 2, saz.Sequence, "")
                        //console.log(saz)
                    }
                    mrg.className = "button is-primary"
                    document.getElementById("details").replaceChildren(pretty, mrg)
                    rendered = true
                }
            })
        }

        return doc
    }
    doc.innerText = "Not found"
    return doc
}

function makeAndSendKind641204(document_uid, patch_uid, operation, sequence, reason) {
    content = JSON.stringify({
        document_uid: document_uid,
        patch_uid: patch_uid,
        operation: operation,
        reason: reason,
        sequence: sequence+1
    })
    p = makeEvent(content, "", 641204)
    signHash(p.id).then(
        function (result) {
            p.sig = result
            sendIt(p)
            console.log(p)
            location.reload()
        }
    )
}

function renderDokiNewDocumentForm() {
    let form = document.createElement("div")
    form.innerHTML = `Create a new document<br /><textarea class="textarea is-link" id="document goal_or_problem input" maxlength="280" rows="4" cols="70" placeholder="the goal of this document, or the problem that it is solving. MUST begin with Goal: or Problem:" style="width: 100%; max-width: 600px;"></textarea>
<button class="button is-primary" onclick="createNewDocument( document.getElementById( 'document goal_or_problem input' ).value)">Create new Doki</button><br><br>`
    return form
}

async function createNewPatch(document_id, patch, problem) {
    content = JSON.stringify({
        document_uid: document_id,
        patch: patch,
        problem: problem,
        sequence: 1
    })
    p = makeEvent(content, "", 641202)
    signHash(p.id).then(
        function (result) {
            p.sig = result
            sendIt(p)
            console.log(p)
            return p.id
        }
    )
}

async function createNewDocument(goal_or_problem) {
    content = JSON.stringify({
        goal_or_problem: goal_or_problem
    })
    p = makeEvent(content, "", 641200)
    signHash(p.id).then(
        function (result) {
            p.sig = result
            sendIt(p)
            console.log(p)
            location.reload()
        }
    )
}