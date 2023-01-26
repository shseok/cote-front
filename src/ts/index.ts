// const $histories = document.querySelector('#histories');
import setRecsWithHistories from './createHistory';
// import { serverAddress } from './settings';

const $loading = document.querySelector('#loading');
const serverAddress = 'https://us-central1-zandi-203bf.cloudfunctions.net/expressapi/histories';
let loading = false;

const getHistoriesFromBackend = async () => {
	loading = true;
	if (!serverAddress) {
		console.log('result of env file is undefined');
		return;
	}
	const res = await fetch(serverAddress);
	const data = await res.json();
	loading = false;
	return data;
};

const addHistoriesToDom = async () => {
	const histories = await getHistoriesFromBackend();
	if (!loading && $loading) {
		$loading.innerHTML = '';
	}
	console.log(histories);
	setRecsWithHistories(histories);
};

addHistoriesToDom();
