import moment from 'moment';

const $historyContainer = document.querySelector('.history-container');
const daysArr = ['일', '월', '화', '수', '목', '금', '토'];

const calcY = (daysIdx: number) => {
	let ny = 0;
	switch (daysIdx) {
		case 0:
			ny = 0;
			break;
		case 1:
			ny = 20;
			break;
		case 2:
			ny = 40;
			break;
		case 3:
			ny = 60;
			break;
		case 4:
			ny = 80;
			break;
		case 5:
			ny = 100;
			break;
		case 6:
			ny = 120;
			break;
		default:
			console.error('error');
	}
	return ny;
};

const initContainerOfRecs = () => {
	const divEl = document.createElement('div');
	const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	divEl.className = 'rec-container';
	svgEl.classList.add('recs');
	svgEl.setAttribute('viewBox', '0 0 1120 180');
	divEl.append(svgEl);
	return divEl;
};

interface MonthCoordinateType {
	[key: number]: number;
}

const initRecsEls = (data: UserDataType[], $recs: Element) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	let now = moment(); // cdn
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	console.log(moment);
	const coordinate: { [key: string]: number } = { x: 1100, y: 0 };
	const monthXCoordinate: MonthCoordinateType = {};
	let color = '#DDDFE0';
	let solvedNum = 0;
	const $fragment = document.createDocumentFragment();

	for (let i = 364; i >= 0; i--) {
		// make a simple rectangle
		const newRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		const dateObj = now.subtract(364 - i, 'days');
		const dayIdx = +dateObj.day();
		const dayInfo = dateObj.format('YYYY-MM-DD');
		const mon = +dayInfo.split('-')[2];
		const day = +dayInfo.split('-')[1];
		if (mon === 1) {
			monthXCoordinate[day] = coordinate.x;
		}
		coordinate.y = calcY(dayIdx);

		solvedNum = data.filter((history) => history.date === dayInfo).length;
		if (solvedNum > 2) {
			color = '#4EB17C';
		} else if (solvedNum > 1) {
			color = '#78CB94';
		} else if (solvedNum > 0) {
			color = '#A1E4AC';
		} else {
			color = '#DDDFE0';
		}

		newRect.setAttribute('width', '18');
		newRect.setAttribute('height', '18');
		newRect.setAttribute('x', `${coordinate.x}`);
		newRect.setAttribute('y', `${coordinate.y}`);
		newRect.setAttribute('rx', '5');
		newRect.setAttribute('fill', color);
		newRect.setAttribute('stroke-width', '2.5');
		newRect.setAttribute('data-date', dayInfo);
		newRect.setAttribute('data-num', solvedNum.toString());

		$fragment.append(newRect);

		if (dayIdx === 0) {
			coordinate.x -= 20;
		}
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		now = moment();
	}

	$recs.append($fragment);
	return monthXCoordinate;
};
const createMonthsEls = (coordinate: MonthCoordinateType, $recs: Element) => {
	const $fragment = document.createDocumentFragment();
	for (const [key, value] of Object.entries(coordinate)) {
		const newText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		newText.setAttribute('font-size', '13');
		newText.setAttribute('text-anchor', 'start');
		newText.setAttribute('x', `${value.toString()}`);
		newText.setAttribute('y', '160');
		newText.setAttribute('dy', '0.3em');
		newText.setAttribute('fill', '#8a8f95');
		newText.textContent = `${key}월`;

		$fragment.append(newText);
	}
	$recs.append($fragment);
};

const createMarkEls = ($recs: Element) => {
	const markRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	const markText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	markRect.classList.add('mark-rect');
	markRect.setAttribute('pointer-events', 'none');
	markRect.setAttribute('width', '200');
	markRect.setAttribute('height', '30');
	markRect.setAttribute('rx', '5');
	markRect.setAttribute('fill', '#000000');
	markRect.setAttribute('display', 'none');

	markText.classList.add('mark-text');
	markText.setAttribute('pointer-events', 'none');
	markText.setAttribute('fill', '#ffffff');
	markText.setAttribute('font-size', '13');
	markText.setAttribute('text-anchor', 'middle');
	markText.setAttribute('display', 'none');
	$recs.append(markRect, markText);
};

const onMouseOver = (e: Event, $markRect: Element, $markText: Element) => {
	const target = e.target as Element;
	if (
		target.classList.contains('mark-rect') ||
		target.classList.contains('mark-text') ||
		target.textContent?.includes('월')
	) {
		return;
	}
	const xOfTarget = target.getAttribute('x');
	const yOfTarget = target.getAttribute('y');
	const markWidth = $markRect.getAttribute('width');
	if (!markWidth || !xOfTarget || !yOfTarget) {
		console.error('Element no found');
		return;
	}
	let targetX = +xOfTarget - (Math.floor(+markWidth / 2) - 10);
	if (+xOfTarget < 160) {
		targetX = +xOfTarget;
	}
	if (+xOfTarget > 1000) {
		targetX = +xOfTarget - (Math.floor(+markWidth / 2) + 80);
	}
	const targetY = +yOfTarget - 34;
	const targetDate = target.getAttribute('data-date');
	const targetSolvedNum = target.getAttribute('data-num');
	$markRect.setAttribute('display', 'inline');
	$markRect.setAttribute('x', `${targetX}`);
	$markRect.setAttribute('y', `${targetY}`);

	$markText.setAttribute('display', 'inline');
	$markText.setAttribute('x', `${targetX + 100}`);
	$markText.setAttribute('y', `${targetY + 16}`);
	$markText.setAttribute('dy', '0.25em');
	$markText.textContent = `날짜: ${targetDate} / 푼 개수: ${targetSolvedNum}`;
};

const onMouseOut = ($markRect: Element, $markText: Element) => {
	$markRect.setAttribute('display', 'none');
	$markRect.removeAttribute('x');
	$markRect.removeAttribute('y');

	$markText.setAttribute('display', 'none');
	$markRect.removeAttribute('x');
	$markRect.removeAttribute('y');
	$markRect.removeAttribute('dy');
	$markText.textContent = '';
};

const handleMarkEevent = ($recs: Element) => {
	const $markRect = $recs.querySelector('.mark-rect');
	const $markText = $recs.querySelector('.mark-text');
	if (!$markRect || !$markText) {
		console.error('element not found');
		return;
	}
	// event bubbling
	$recs.addEventListener('mouseover', (e) => onMouseOver(e, $markRect, $markText));

	$recs.addEventListener('mouseout', () => onMouseOut($markRect, $markText));

	// not event bubbling
	// Array.from($recs.children).forEach((recEl) => {
	//   recEl.addEventListener('mouseover', (e) => {});
	//   recEl.addEventListener('mouseout', () => {});
	// });
};

interface dayType {
	[key: string]: string;
}

const initContainerOfDays = () => {
	const divEl = document.createElement('div');
	const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	let targetY = 10;
	const fillColor: dayType = {
		일: '#de3163',
		월: '#8a8f95',
		화: '#8a8f95',
		수: '#8a8f95',
		목: '#8a8f95',
		금: '#8a8f95',
		토: '#68b6ef',
	};
	divEl.className = 'days-container';
	svgEl.classList.add('days');
	svgEl.setAttribute('viewBox', '0 0 60 170');
	daysArr.forEach((eachDay) => {
		const newText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		newText.setAttribute('font-size', '13');
		newText.setAttribute('text-anchor', 'middle');
		newText.setAttribute('x', '8');
		newText.setAttribute('y', `${targetY}`);
		newText.setAttribute('dy', '0.3em');
		newText.setAttribute('fill', `${fillColor[eachDay]}`);
		newText.textContent = eachDay;
		svgEl.append(newText);
		targetY += 20;
	});
	divEl.append(svgEl);
	return divEl;
};

interface UserDataType {
	id: string;
	user: string;
	tags: string;
	date: string;
}

interface UserData {
	[key: string]: UserDataType[];
}

const setRecsWithHistories = (usersData: UserData) => {
	for (const [userName, userData] of Object.entries(usersData)) {
		const $userContainer = document.createElement('div');
		$userContainer.className = 'user-container';
		const $nameContainer = document.createElement('div');
		$nameContainer.className = 'user-name-container';
		$nameContainer.textContent = userName;
		const $infoContainer = document.createElement('div');
		$infoContainer.className = 'user-info-container';
		const $gap = document.createElement('div');
		$gap.className = 'gap';

		const $recsContainer = initContainerOfRecs();
		const $recs = $recsContainer.querySelector('.recs');
		if (!$recs) return;
		const monthXCoordinate = initRecsEls(userData, $recs);
		createMonthsEls(monthXCoordinate, $recs);
		createMarkEls($recs);
		handleMarkEevent($recs);
		const $daysContainer = initContainerOfDays();

		$infoContainer.append($recsContainer, $daysContainer);
		$userContainer.append($nameContainer, $infoContainer);
		if (!$historyContainer) {
			console.error('historyContainer empty');
			return;
		}
		$historyContainer.append($gap, $userContainer);
	}
};

export default setRecsWithHistories;
