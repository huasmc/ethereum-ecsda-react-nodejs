import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ privateKey, setPrivateKey, balance, setBalance }) {
	const [isKeyInvalid, setIsKeyInvalid] = useState(false);
	const [address, setAddress] = useState("");
	async function onChange(evt) {
		const privateKey = evt.target.value;
		if (privateKey.length >= 64) {
			setPrivateKey(privateKey);
			let publicKey = secp.getPublicKey(privateKey);
			setAddress(toHex(publicKey));
			setIsKeyInvalid(false);
		} else setIsKeyInvalid(true);
		setPrivateKey(privateKey);
		if (privateKey) {
			const {
				data: { balance },
			} = await server.get(`balance/${privateKey}`);
			setBalance(balance);
		} else {
			setBalance(0);
		}
	}

	return (
		<div className="container wallet">
			<h1>Your Wallet</h1>

			<label>
				Private Key
				<input
					placeholder="(Testing purposes) add private key"
					value={privateKey}
					onChange={onChange}
				></input>
			</label>

			<p>Address {address.slice(0, 10)}...</p>

			<div className="balance">Balance: {balance}</div>
			{isKeyInvalid && privateKey.length ? (
				<p style={{ color: "red" }}>Invalid Key</p>
			) : (
				""
			)}
		</div>
	);
}

export default Wallet;
