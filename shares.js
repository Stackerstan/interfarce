const sharesObjects = new Map();
function enMapShareObject(account, share) {
    sharesObjects.set(account, share)
}

function logShareObjects() {
    sharesObjects.forEach(function (v, k) {
        console.log("Account: ", k, " Shares: ", v)
    })
}