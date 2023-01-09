import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";

export function getAddress(publicKey) {
	const slicedPublicKey = publicKey.slice(1, publicKey.length);
	const hash = keccak256(slicedPublicKey);
	return toHex(hash.slice(-20));
}
