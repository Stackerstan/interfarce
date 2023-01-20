var sha256  = bitcoinjs.crypto.sha256
function waitForNostr(callback) {
    var interval = setInterval(function () {
        if (window.nostr) {
            clearInterval(interval);
            callback();
        }
    }, 200);
}

// waitForNostr(function () {
//     console.log()
//     window.nostr.getPublicKey().then(k => {
//         console.log(k)
//         testSignEvent(k).then(signed => {
//
//             console.log(JSON.stringify(signed))
//         })
//     })
// })

async function getMuhPubkey() {
    if (window.nostr) {
        pubKey = ""
        return await window.nostr.getPublicKey()
    } else {
        if (pubKey.length > 0) {
            return pubKey
        } else {
            return generateKeypair()
        }
    }
}

var pubKey = ""

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
    if ((localStorage.getItem('privatekey') !== null) && (localStorage.getItem("usenos2x") !== 'true')) {
        pubKeyTemp = nobleSecp256k1.getPublicKey(localStorage.getItem('privatekey'), true);
    }

    //be aware that not all valid bitcoin pubkeys are valid nostr pubkeys. Valid bitcoin pubkeys include uncompressed pubkeys (that start with 04), compressed pubkeys whose y coordinate is positive (that start with 02), and compressed pubkeys whose y coordinate is negative (that start with 03).
    //Only the ones that start with 02 are valid for nostr, which then allows us to chop off the 02 when storing the pubkey.
    //So if you change this code to generate random pubkeys, be sure to only use ones that have an 02 at the beginning.
    //The pubkeyMinus2 variable is the pubkey created a moment ago but without the 02 at the beginning.
    pubKey = pubKeyTemp.substring(2);
    return pubKey
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



async function testSignEvent() {
    getMuhPubkey().then(pubkey => {
        var now = Math.floor( Date.now() / 1000 );
        var event = {
            "content"    : "test note",
            "created_at" : now,
            "kind"       : 1,
            "tags"       : [],
            "pubkey"     : pubkey,
        }
        signEvent( event ).then(signed => {
            return signed
        })
    })

    // if (window.nostr) {
    //     console.log()
    //     window.nostr.getPublicKey().then(pubkey => {
    //         console.log()
    //         event.pubkey = pubkey
    //         return signEvent( event );
    //     })
    // } else if (pubKey.length > 0) {
    //     console.log()
    //     event.pubkey = pubKey
    // } else {
    //     console.log()
    //     alert("you don't have a pubkey")
    // }
    // console.log()
    // //return signEvent( event );
}

async function signEvent(event) {
    var eventArray = [
        0,                    // Reserved for future use
        event['pubkey'],        // The sender's public key
        event['created_at'],    // Unix timestamp
        event['kind'],        // Message “kind” or type
        event['tags'],        // Tags identify replies/recipients
        event['content']        // Your note contents
    ];
    var eventData = JSON.stringify( eventArray );
    event.id  = sha256( eventData ).toString( 'hex' )
    if (!window.nostr) {
        alert("no nostr")
    }
    if (window.nostr) {
        signWithNos2x()
    }
    window.nostr.signEvent( event ).then(signedEvent => {
            console.log()
            if ( typeof( signedEvent ) == "string" ) {
                console.log(times)
                console.log(signedEvent)
                event.sig = signedEvent;
            } else {
                console.log(times)
                console.log(signedEvent.sig)
                event.sig = signedEvent.sig;
            }
            return event
        })
}

async function signWithNos2x(event) {
    let sig = await window.nostr.signEvent( event )
    return sig
}


async function signAsynchronously(event) {
    event.id = window.NostrTools.getEventHash(event)
    if (false) {
        event.sig = await signEvent(event, store.state.keys.priv)
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