//game
let tableGame = document.getElementById('database2')
let gameCell = [...tableGame.rows].map(t => [...t.children].map(u => u.innerText))
let gameHead = [...tableGame.tHead.children].map(u => u.innerText)
//goal
let tableGoal = document.getElementById('database1')
let goalCell = [...tableGoal.rows].map(t => [...t.children].map(u => u.innerText))
let goalHead = [...tableGoal.tHead.children].map(u => u.innerText)



let allData = []

const findTeamInGoal = (name,id) => {
	let counter = 0;
	goalCell.forEach(element => {
		let match = goalHead.indexOf('matchid')
		let team = goalHead.indexOf('teamid')
		if (element[team] === name && element[match] == id) {
			counter += 1
		}else{
			return
		}
	});
	return counter
}

//prepare for label data
const goalTextLabel = (arr)=>{
	let gameData = {}
	let name = ''
	let team1 = 0;
	let team2 = 0;
	let match = goalHead.indexOf('matchid')
	let currentId = arr[match]
	arr.forEach((itemText, index) => {
		if (gameHead[index] === 'id') {
			gameData.gameId = itemText
		} else if (gameHead[index] === 'team1') {
			name += itemText
			gameData.team1 = itemText
			team1 = findTeamInGoal(itemText, currentId)
		} else if (gameHead[index] === 'team2') {
			gameData.team2 = itemText
			team2 = findTeamInGoal(itemText, currentId)
			name += ' - ' + itemText + ' (' + team1 + ' - ' + team2 + ')'
			gameData.gameName = name
		}
	})
	return gameData
}


const builderDataChart = (arr) => {
	arr.forEach(el => {
		let result = goalTextLabel(el)
		allData.push(result)
	})
}

const setTotalScoreForChart=(arr)=>{
	arr.forEach(el => {
	let id = el.gameId
	el.score = 0
	let match = goalHead.indexOf('matchid')
	goalCell.forEach(item=>{
		if (item[match] === id){
			el.score += 1
		}
	})
})
}


const sortByRow = () => {
	let resultClick = event.target.parentElement;
	let allResultClick = [...resultClick.children].map(u => u.innerText)
	let resultSort = goalTextLabel(allResultClick)
	updateShart(resultSort)
}

const sortByRowGoal = () => {
	let resultClick = event.target.parentElement;
	let allResultClick = [...resultClick.children].map(u => u.innerText)
	let match = goalHead.indexOf('matchid')
	let id = gameHead.indexOf('id')
	let currentId = allResultClick[match]
	let currentClickData = []
	gameCell.forEach(el=>{if(el[id] == currentId) currentClickData = el})
	let resultSort = goalTextLabel(currentClickData)
	updateShart(resultSort)
}

//add onclickhandler
let gameHandlers = [...tableGame.rows].map(el => {
	el.addEventListener('click', sortByRow, false);
})

let goalHandlers = [...tableGoal.rows].map(el => {
	el.addEventListener('click', sortByRowGoal, false);
})


let prepareDataChart = (arr)=>{
	const dataForChart = arr.map(el => el.score)
	const labelForChart = arr.map(el => el.gameName)
	const uniqColor = arr.map(el => {
		r = Math.floor(Math.random() * 200);
		g = Math.floor(Math.random() * 200);
		b = Math.floor(Math.random() * 200);
		c = 'rgb(' + r + ', ' + g + ', ' + b + ')';
		return c
	})
	return {
		dataForChart,
		labelForChart,
		uniqColor
	}
}


builderDataChart(gameCell);
setTotalScoreForChart(allData)
let preparedData = prepareDataChart(allData)



let ctx = document.getElementById('myChart').getContext('2d');

let data = {
	labels: preparedData.labelForChart,
	datasets: [{
		data: preparedData.dataForChart,
		backgroundColor: preparedData.uniqColor
	}],
}
var myPieChart = new Chart(ctx, {
	type: 'pie',
	data: data,
	options: {
		legend: {
			position: 'right'
		},
	title: {
			display: true,
			text: ''
		}
	}
});


const updateShart = (newArr)=>{

	let team1 = 0;
	let team2 = 0;
	const allTeam = []
	const newLabelForChart = []
	team1 = findTeamInGoal(newArr.team1, newArr.gameId)
	allTeam.push(team1)
	newLabelForChart.push(newArr.team1)
	team2 = findTeamInGoal(newArr.team2, newArr.gameId)
	allTeam.push(team2)
	newLabelForChart.push(newArr.team2)

	const newUniqColor = allTeam.map(el => {
		r = Math.floor(Math.random() * 200);
		g = Math.floor(Math.random() * 200);
		b = Math.floor(Math.random() * 200);
		c = 'rgb(' + r + ', ' + g + ', ' + b + ')';
		return c
	})
	let newData = {
		labels: newLabelForChart,
		datasets: [{
			data: allTeam,
			backgroundColor: newUniqColor
		}],
	}
	myPieChart.data = newData
	myPieChart.options.title.text = newArr.gameName
	myPieChart.update()
}


const handleReset = ()=> {

	let preparedData = prepareDataChart(allData)

	let data = {
		labels: preparedData.labelForChart,
		datasets: [{
			data: preparedData.dataForChart,
			backgroundColor: preparedData.uniqColor
		}],
	}
	myPieChart.data = data
	myPieChart.options.title.text = ''
	myPieChart.update()
}