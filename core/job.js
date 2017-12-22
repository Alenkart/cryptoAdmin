function Job(time, cb) {

	this.start = () => {
		this.interval = setInterval(cb, time);
	}

	this.stop = () => {
		clearInterval(this.interval);
	}

}

module.exports = Job;