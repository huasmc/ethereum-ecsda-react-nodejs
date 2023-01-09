const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

function hashContent(content) {
	const contentInBytes = utf8ToBytes(content);
	const hash = keccak256(contentInBytes);
	return hash;
}

module.exports = { hashContent };
