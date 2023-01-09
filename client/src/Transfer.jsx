import { useState, useEffect } from "react";
import { formatAddress } from "../utils/formatAddress";
import server from "./server";

function Transfer({
	signature,
	setBalance,
	setModalOpen,
	setTransaction,
	setSignature,
}) {
	const [amount, setAmount] = useState("");
	const [recipientAddress, setRecipientAddress] = useState("");
	const setValue = (setter) => (evt) => setter(evt.target.value);

	useEffect(() => {
		if (signature) transfer();
	}, [signature]);

	useEffect(() => {
		setTransaction({ amount, recipientAddress });
	}, [amount, recipientAddress]);

	async function transfer() {
		try {
			const {
				data: { balance },
			} = await server.post(`send`, signature);
			setBalance(balance);
			setSignature(null);
			setModalOpen(false);
		} catch (ex) {
			// alert(ex.response.data.message);
		}
	}

	function promptSignature(evt) {
		evt.preventDefault();
		setModalOpen(true);
	}

	return (
		<form className="container transfer" onSubmit={promptSignature}>
			<h1>Send Transaction</h1>

			<label>
				Send Amount
				<input
					placeholder="1, 2, 3..."
					value={amount}
					onChange={setValue(setAmount)}
				></input>
			</label>

			<label>
				Recipient Address
				<input
					placeholder="Type an address, for example: 0x2"
					value={recipientAddress}
					onChange={setValue(setRecipientAddress)}
				/>
				<p>{`Address ${formatAddress(recipientAddress)}`}</p>
			</label>

			<input
				type="submit"
				className="button"
				value="Transfer"
				style={{
					backgroundColor: recipientAddress && amount ? "" : "gray",
				}}
			/>
		</form>
	);
}

export default Transfer;
