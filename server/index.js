const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
	"046f2f8e32f8a6ff5dd8c9aef4f6bb24e79cde4f864004bd27c7c8b030ec9e53ffc2af5d84c9377cca43977404b338e30d1d0e24d17f6af850bc": 100,
	"042a019a951d2fabc1694a0f65a6ef8d7b7387d1952aa554d4c57827ce948b95534987d5da79939e40f9caafb7e3e271c307eafd9776cd9a26a7": 50,
	"04d384dba3887c922dff77ef30be522119fd9823e4d26b39382ac4039427788071e4fd6b8e13ce00a1a67a5510aeabfc422c2cc75067e9608962": 75,
};

app.get("/balance/:address", (req, res) => {
	const { address } = req.params;
	const balance = balances[address] || 0;
	res.send({ balance });
});

app.post("/send", (req, res) => {
	const { signature } = req.body;
	console.log(signature);
	// setInitialBalance(sender);
	// setInitialBalance(recipient);

	// if (balances[sender] < amount) {
	// 	res.status(400).send({ message: "Not enough funds!" });
	// } else {
	// 	balances[sender] -= amount;
	// 	balances[recipient] += amount;
	// 	res.send({ balance: balances[sender] });
	// }
});

app.listen(port, () => {
	console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
	if (!balances[address]) {
		balances[address] = 0;
	}
}
