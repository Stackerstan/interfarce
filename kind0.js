const kind0Objects = new Map();
function enMapKind0Object(e) {
    c = e//JSON.parse(e)
    if (c.kind === 0) {
        d = JSON.parse(c.content)
        kind0Objects.set(c.pubkey, d)
        console.log(d)
    }
}