export function formatAddress(address) {
	const firstChars = address.slice(0, 3);
	const lastChars = address.slice(address.length - 5, address.length);
	return "0x" + firstChars + "..." + lastChars;
}
