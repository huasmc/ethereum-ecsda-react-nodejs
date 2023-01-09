const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { getAddress } = require("./getAddress");
const { keccak256 } = require("ethereum-cryptography/keccak");

function getAddress(publicKey) {
	const slicedPublicKey = publicKey.slice(1, publicKey.length);
	const hash = keccak256(slicedPublicKey);
	return toHex(hash.slice(-20));
}

for (let i = 0; i < 3; i++) {
	const privateKey = secp.utils.randomPrivateKey();

	console.log("private key:", toHex(privateKey));

	const publicKey = secp.getPublicKey(privateKey);

	console.log("address:", getAddress(publicKey));
}
