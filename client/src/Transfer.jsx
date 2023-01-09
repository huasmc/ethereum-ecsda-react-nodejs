import { useState, useEffect } from "react";
import server from "./server";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import * as secp from "ethereum-cryptography/secp256k1";

function Transfer({ privateKey, setBalance }) {
	const [sendAmount, setSendAmount] = useState("");
	const [recipient, setRecipient] = useState("");
	const [isSigned, setIsSigned] = useState(false);
	const [signature, setSignature] = useState(null);
	const setValue = (setter) => (evt) => setter(evt.target.value);

	async function transfer(evt) {
		evt.preventDefault();
		try {
			const {
				data: { balance },
			} = await server.post(`send`, signature);
			setBalance(balance);
			setIsSigned(false);
			setSignature(null);
		} catch (ex) {
			alert(ex.response.data.message);
		}
	}

	async function sign() {
		if (recipient && sendAmount) {
			const publicKey = secp.getPublicKey(privateKey);
			const transaction = {
				sender: toHex(publicKey),
				recipient,
				amount: parseInt(sendAmount),
			};
			const transactionBytes = utf8ToBytes(JSON.stringify(transaction));
			const hashedTransaction = keccak256(transactionBytes);
			// Recovered or recovery bit allows to recover public key from signature
			const [signature, recoveryBit] = await secp.sign(
				hashedTransaction,
				privateKey,
				{
					recovered: true,
				}
			);
			// Server receives Uint8Array as object to be converted
			setSignature({
				signatureObject: signature,
				recoveryBit,
				transaction,
				publicKeyObject: publicKey,
			});
			setIsSigned(true);
		}
	}

	useEffect(() => {
		setIsSigned(false);
	}, [privateKey, recipient, sendAmount]);

	return (
		<form className="container transfer" onSubmit={transfer}>
			<h1>Send Transaction</h1>

			<label>
				Send Amount
				<input
					placeholder="1, 2, 3..."
					value={sendAmount}
					onChange={setValue(setSendAmount)}
				></input>
			</label>

			<label>
				Recipient
				<input
					placeholder="Type an address, for example: 0x2"
					value={recipient}
					onChange={setValue(setRecipient)}
				></input>
			</label>

			<button
				type="button"
				className="button"
				onClick={sign}
				style={{
					backgroundColor: privateKey && sendAmount && recipient ? "" : "gray",
				}}
			>
				Sign Transaction
			</button>

			<input
				type="submit"
				className="button"
				value="Transfer"
				style={{ backgroundColor: isSigned ? "" : "gray" }}
				disabled={!isSigned}
			/>
			{isSigned && <p style={{ color: "green" }}>Succesfully signed</p>}
		</form>
	);
}

export default Transfer;
