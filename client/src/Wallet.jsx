import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { hashContent } from "../utils/hashContent";
import { getAddress } from "../utils/getAddress";
import { formatAddress } from "../utils/formatAddress";

function Wallet({
	balance,
	setBalance,
	modalOpen,
	setModalOpen,
	transaction,
	setSignature,
}) {
	const [isKeyInvalid, setIsKeyInvalid] = useState(false);
	const [privateKey, setPrivateKey] = useState("");
	const [address, setAddress] = useState("");

	async function onAddressChange(evt) {
		const address = evt.target.value;
		setAddress(address);
		if (address) {
			const {
				data: { balance },
			} = await server.get(`balance/${address}`);
			setBalance(balance);
		} else {
			setBalance(0);
		}
	}

	async function onPrivateKeyChange(evt) {
		const privateKey = evt.target.value;
		setPrivateKey(privateKey);
		if (privateKey) setIsKeyInvalid(false);
	}

	async function sign() {
		const publicKey = secp.getPublicKey(privateKey);
		if (getAddress(publicKey) !== address) {
			setIsKeyInvalid(true);
			setModalOpen(false);
			setPrivateKey(null);
			return;
		}
		const { amount, recipientAddress } = transaction;
		if (recipientAddress && amount) {
			const hashedTransaction = hashContent(JSON.stringify(transaction));
			const [signature, recoveryBit] = await secp.sign(
				hashedTransaction,
				privateKey,
				{
					recovered: true,
				}
			);
			setSignature({
				signatureObject: signature,
				transaction,
				recoveryBit,
			});
		}
	}

	function handleCloseModal() {
		setModalOpen(false);
	}

	return (
		<div className="container wallet">
			<h1>Your Wallet</h1>

			<label>
				Wallet Address
				<input
					placeholder="Add wallet address"
					value={address}
					onChange={onAddressChange}
				/>
			</label>

			<p>
				{isKeyInvalid ? "Invalid key" : `Address ${formatAddress(address)}`}
			</p>

			<div className="balance">Balance: {balance}</div>
			{isKeyInvalid ? <p style={{ color: "red" }}>Invalid Key</p> : ""}
			<Modal open={modalOpen} onClose={handleCloseModal} center>
				<div>
					<label>
						Private Key
						<input
							placeholder="(Never add private key) use mock private key"
							defaultValue={privateKey}
							onChange={onPrivateKeyChange}
							type="password"
						/>
					</label>
					<button
						type="button"
						className="button"
						onClick={sign}
						style={{
							backgroundColor: privateKey && address ? "" : "gray",
						}}
						disabled={!privateKey || privateKey.length < 64}
					>
						Sign Transaction
					</button>
				</div>
			</Modal>
		</div>
	);
}

export default Wallet;
