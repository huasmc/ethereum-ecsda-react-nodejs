const secp = require("ethereum-cryptography/secp256k1");
const express = require("express");
const app = express();
const cors = require("cors");
const { initalWallets } = require("./utils/wallets");
const { hashContent } = require("./utils/hashContent");
const getAddress = require("./utils/getAddress");

const port = 3042;

app.use(cors());
app.use(express.json());

let wallets = [...initalWallets];

app.get("/balance/:address", (req, res) => {
	const { address } = req.params;
	const balance = getBalance(address);
	res.send({ balance });
});

app.post("/send", async (req, res) => {
	const { signatureObject, transaction, recoveryBit } = req.body;
	const signature = new Uint8Array(Object.values(signatureObject));
	const hashedTransaction = hashContent(JSON.stringify(transaction));
	const { recipientAddress, amount } = transaction;
	const publicKey = secp.recoverPublicKey(
		hashedTransaction,
		signature,
		recoveryBit
	);

	if (publicKey) {
		const senderAddress = getAddress(publicKey);
		if (getBalance(senderAddress) < amount) {
			res.status(400).send({ message: "Not enough funds!" });
		} else {
			decreaseBalance(senderAddress, amount);
			increaseBalance(recipientAddress, amount);
			res.send({ balance: getBalance(senderAddress) });
		}
	} else res.send("Unauthorized");
});

app.listen(port, () => {
	console.log(`Listening on port ${port}!`);
});

function getBalance(address) {
	const { balance } = wallets.find(
		(wallet) => wallet.privateKey === address || wallet.address === address
	) || { balance: 0 };
	return balance;
}

function decreaseBalance(address, amount) {
	wallets = wallets.map((wallet) => {
		if (wallet.address === address) {
			wallet.balance -= parseInt(amount);
		}
		return wallet;
	});
}

function increaseBalance(address, amount) {
	wallets = wallets.map((wallet) => {
		if (wallet.address === address) {
			wallet.balance += parseInt(amount);
		}
		return wallet;
	});
}
