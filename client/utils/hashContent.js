import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

export function hashContent(content) {
	const contentInBytes = utf8ToBytes(content);
	const hash = keccak256(contentInBytes);
	return hash;
}
