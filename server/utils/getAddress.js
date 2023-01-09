const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

function getAddress(publicKey) {
	const slicedPublicKey = publicKey.slice(1, publicKey.length);
	const hash = keccak256(slicedPublicKey);
	return toHex(hash.slice(-20));
}

module.exports = getAddress;
