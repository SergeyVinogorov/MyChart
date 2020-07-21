try {
	// 表1数据
	alasql("CREATE TABLE goal (matchid INT, teamid STRING, player STRING, gtime INT)");
	alasql("INSERT INTO goal VALUES (1001, 'POL', 'Robert', '17')");
	alasql("INSERT INTO goal VALUES (1001, 'GRE', 'Dim', '51')");
	alasql("INSERT INTO goal VALUES (1002, 'RUS', 'Alan', '15')");
	alasql("INSERT INTO goal VALUES (1002, 'RUS', 'Roman', '82')");
	alasql("INSERT INTO goal VALUES (1003, 'CZE', 'Dimitriy', '93')");
	

	// 表2数据
	alasql("CREATE TABLE game (id INT, mdate STRING, stadium STRING, team1 STRING, team2 STRING)");
	alasql("INSERT INTO game VALUES (1001, '8 JUNE 2012', 'National Stadium', 'POL', 'GRE')");
	alasql("INSERT INTO game VALUES (1002, '8 JUNE 2012', 'Stadion Miejsky', 'RUS', 'CZE')");
	alasql("INSERT INTO game VALUES (1003, '12 JUNE 2012', 'Stadion Miejsky', 'GRE', 'CZE')");

	// 表1渲染
	const data1 = alasql('select * from goal')
	const database1 = document.getElementById('database1')
	renderData(data1, database1)

	// 表2渲染
	const data2 = alasql('select * from game')
	const database2 = document.getElementById('database2')
	renderData(data2, database2)
} catch (e) {
	alert(e)
}


// Run按钮
function handleRunClick() {
	const sql = document.getElementById('sql-input').value
	if (!sql) {
		alert('sql is empty')
		return
	}

	alasql.promise(sql).then(data => {
		const tableEl = document.getElementById('result')
		renderData(data, tableEl)
	}).catch(e => {
		alert(e)
	})
}

// Clear按钮
function handleClearClick() {
	const tableEl = document.getElementById('result')
	while (tableEl.firstChild) tableEl.removeChild(tableEl.firstChild);
}

// 展示查询结果
function renderData(data, tableEl) {
	if (!data.length) return
	const columnNameList = Object.keys(data[0])

	const thead = document.createElement('thead')
	columnNameList.forEach(columnName => {
		const th = document.createElement('th')
		th.textContent = columnName
		thead.appendChild(th)
	})

	const tbody = document.createElement('tbody')

	data.forEach(row => {
		const tr = document.createElement('tr')
		columnNameList.forEach(columnName => {
			const td = document.createElement('td')
			td.textContent = row[columnName]
			tr.appendChild(td)
		})
		tbody.appendChild(tr)
	})

	while (tableEl.firstChild) tableEl.removeChild(tableEl.firstChild);
	tableEl.appendChild(thead)
	tableEl.appendChild(tbody)
}