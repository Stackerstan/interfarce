var sha256  = bitcoinjs.crypto.sha256
function waitForNostr(callback) {
    var interval = setInterval(function () {
        if (window.nostr) {
            clearInterval(interval);
            callback();
        }
    }, 200);
}

async function getMuhPubkey() {
    var pubKey = ""
    if (window.nostr) {
        return await window.nostr.getPublicKey()
    } else {
        if (pubKey.length > 0) {
            return pubKey
        } else {
            return generateKeypair()
        }
    }
}

//generate a keypair, set private key and seed words in localstorage and return the pubkey
function generateKeypair() {
    var pubKeyTemp = ""
    if ((localStorage.getItem('backupwords') === null) && (localStorage.getItem('privatekey') === null)){
        localStorage.setItem('backupwords', bip39.generateMnemonic())
    }
    if (localStorage.getItem('backupwords') !== null) {
        var privKey = getPrivkeyHex(localStorage.getItem('backupwords'));
        privKey = privKey.__D.toString('hex');
        localStorage.setItem('privatekey', privKey)
    }
    if (localStorage.getItem('privatekey') !== null) {
        pubKeyTemp = nobleSecp256k1.getPublicKey(localStorage.getItem('privatekey'), true);
    }

    //be aware that not all valid bitcoin pubkeys are valid nostr pubkeys. Valid bitcoin pubkeys include uncompressed pubkeys (that start with 04), compressed pubkeys whose y coordinate is positive (that start with 02), and compressed pubkeys whose y coordinate is negative (that start with 03).
    //Only the ones that start with 02 are valid for nostr, which then allows us to chop off the 02 when storing the pubkey.
    //So if you change this code to generate random pubkeys, be sure to only use ones that have an 02 at the beginning.
    //The storedPubkey variable is the pubkey created a moment ago but without the 02 at the beginning.
    return pubKeyTemp.substring(2)
}

function computeRawPrivkey(node) {
    return bitcoinjs.ECPair.fromPrivateKey(node.privateKey, {network: bitcoinjs.networks.mainnet});
}

function getPrivkeyHex(backupwords) {
    var seed = bip39.mnemonicToSeedSync(backupwords);
    var node = bip32.fromSeed(seed);
    var npath = `m/44'/1237'/0'/0/0`
    var child = node.derivePath(npath);
    return computeRawPrivkey(child);
}

function toHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}


async function signAsynchronously(event) {
    event.id = window.NostrTools.getEventHash(event)
    if (!window.nostr) {
        console.log("no nostr")
        privateKey = localStorage.getItem('privatekey')
        if ((typeof privateKey) === "string") {
            sig = window.NostrTools.signEvent(event, privateKey)
            event.sig = sig
            return event
        } else {
            throw new Error('No private key found.')
        }
    } else if (window.nostr) {
        let signatureOrEvent = await window.nostr.signEvent(event)
        switch (typeof signatureOrEvent) {
            case 'string':
                event.sig = signatureOrEvent
                break
            case 'object':
                event.sig = signatureOrEvent.sig
                break
            default:
                throw new Error('Failed to sign with Nostr extension.')
        }
    }
    return event
}

function signHash(hash) {
    return nobleSecp256k1.schnorr.sign(hash, privKey)
}