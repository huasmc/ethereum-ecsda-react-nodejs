import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
	const [balance, setBalance] = useState(0);
	const [signature, setSignature] = useState();
	const [transaction, setTransaction] = useState();
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<div className="app">
			<Wallet
				balance={balance}
				setBalance={setBalance}
				signature={signature}
				setSignature={setSignature}
				modalOpen={modalOpen}
				setModalOpen={setModalOpen}
				transaction={transaction}
			/>
			<Transfer
				setBalance={setBalance}
				signature={signature}
				setModalOpen={setModalOpen}
				setTransaction={setTransaction}
				setSignature={setSignature}
			/>
		</div>
	);
}

export default App;
