const secp = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { Buffer } = require("buffer");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = [
	{
		privateKey:
			"3745a663f79fe3a4a98d2e4f0b2000a007d037ab07c51e2b0b9d365542f1864b",
		publicKey:
			"04d0831078160a7c8c40d1e6503068124c9902eb638bb2bc5fdb0d54dd0964557a7006021ab10832173f0e3947a3bcbd79e83046b18c90b27a949854523a4219c4",
		balance: 100,
	},
	{
		privateKey:
			"5833b9af800c154a55f1270ce1cefa8014500c0c9c8d3b4b8dca605449c3a437",
		publicKey:
			"04c0930e8c860ee57406b48d327cf5147a12faf4834f1d9ed36215f6e1cc7af6621cf546e324e5d8439f2735e907e6e8e7e1b773fbec6e2107657ef61eef66ef60",
		balance: 100,
	},
	{
		privateKey:
			"0c22d52394ddcaaf4e19408506626b98bcffbc35b66075ba3d65fe52c97dd192",
		publicKey:
			"046369561ad987c34aeeacf54f563baa7ab3627d2a7edf0ae79e33d22c86ef7860ec7f07221d45fd370a582b932728613f3b64f71e8e15a6ffe5a20b9363592a31",
		balance: 100,
	},
];

app.get("/balance/:address", (req, res) => {
	const { address } = req.params;
	const { balance } = balances.find((wallet) => {
		if (wallet.privateKey === address) return wallet;
	});
	res.send({ balance });
});

app.post("/send", async (req, res) => {
	const { signatureObject, recoveryBit, transaction, publicKeyObject } =
		req.body;
	const signature = new Uint8Array(Object.values(signatureObject));
	const publicKey = new Uint8Array(Object.values(publicKeyObject));
	const transactionInBytes = utf8ToBytes(JSON.stringify(transaction));
	const hashedTransaction = keccak256(transactionInBytes);

	const expectedPublicKey = secp.recoverPublicKey(
		hashedTransaction,
		signature,
		recoveryBit
	);
	if (toHex(expectedPublicKey) === toHex(publicKey)) {
		const { sender, recipient, amount } = transaction;
		setInitialBalance(sender);
		setInitialBalance(recipient);

		if (balances[sender] < amount) {
			res.status(400).send({ message: "Not enough funds!" });
		} else {
			balances[sender] -= amount;
			balances[recipient] += amount;
			res.send({ balance: balances[sender] });
		}
	} else res.send("Unauthorized");
});

app.listen(port, () => {
	console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
	if (!balances[address]) {
		balances[address] = 0;
	}
}
