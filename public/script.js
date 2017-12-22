const currency = 'XRP';

fetch(`/data?coin=${currency}`).then(res => {
	return res.json();
}).then(initChart).catch(err => {
	console.log(err);
});

function getRandomColor() {
	
	var letters = '0123456789ABCDEF';
	var color = '#';
	
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}

	return color;
}


function createDataset(key, data) {

	const color = getRandomColor();

	return {
		label: key,
        fill: false,
        backgroundColor: color,
        borderColor: color,
        data: data,
    }
}

function getDatasets(keys, data) {
	return keys.map(key => {
		return createDataset(key, data[key]);
	});
}

function getLabels() {
 	return new Array(100).fill().map(i => i);
}

function initChart(rawData) {

	const keys = Object.keys(rawData);

	const datasets = getDatasets(keys, rawData);

	const labels = [...Array(rawData[currency].length).keys()];

	console.log(labels);

	const ctx = document.getElementById("canvas").getContext('2d');

	const myChart = new Chart(ctx, {
	    type: 'line',
	    data: {
	       	labels: labels,
	        datasets: datasets
	    },
	    options: {
	        scales: {
	        	xAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }],
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }]
	        }
	    }
	});

}

