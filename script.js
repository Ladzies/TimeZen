// SETTINGS
const Settings = {
	DEFAULT_ARM_INDEX: 1, //default index is where the tick is by default
	TOTAL_STEPS: 60, //total steps for completing 360 deg
	MINUTE_PER_STEP: 1,
}

// STATE
const State = {
	minutes: null,
	degree: null,
}

// FORMULA FUNCITON
const Formula = {
	calcDegreePerStep: () => -(360 / Settings.TOTAL_STEPS),
	calcDefaultDegree: () => -(360 / Settings.TOTAL_STEPS) * Settings.DEFAULT_ARM_INDEX,
	calcLiveDegree: e =>
		Math.atan2(e.pageX - (rect.x + radius), e.pageY - (rect.y + radius)) * (180 / Math.PI) * -1 -
		180,
	calcClosestLiveDegree: e =>
		Math.round(Formula.calcLiveDegree(e) / Formula.calcDegreePerStep()) *
		Formula.calcDegreePerStep(),
	calcTotalTime: (degree = Formula.calcDefaultDegree()) =>
		(degree / Formula.calcDegreePerStep()) * Settings.MINUTE_PER_STEP,
}

// HELPER FUNCTIONS
const Helper = {
	formatDouble: digit => (digit < 10 ? '0' + digit : digit),
}

// INTERACTION
const Interaction = {
	changeOpacity: (transition, opacity) => {
		for (i = 0; i < Query.pointerShort.length; i++) {
			Query.pointerShort[i].style.transition = transition
			Query.pointerShort[i].style.opacity = opacity
		}
	},
}

// QUERY
const Query = {
	timerCirclePath: document.querySelector('.timerCirclePath'),
	timerDisplay: document.querySelector('.timerDisplay'),
	timerBox: document.querySelector('.timerBox'),
	timerArm: document.querySelector('.timerArm'),
	startButton: document.querySelector('.btn'),
	pointerShort: document.querySelectorAll('.pointerShort'),
}

/**
 Event When Document Loads
 */

document.addEventListener('DOMContentLoaded', () => documentDidLoad())

function documentDidLoad() {
	// console.log('Document Loaded')
	State.minutes = Formula.calcTotalTime()
	State.degree = Formula.calcDefaultDegree()
	Query.startButton.disabled = false
	Query.timerArm.style.transform = `rotate(${State.degree}deg)`
	Query.timerDisplay.textContent = `${State.minutes}:00`
	Interaction.changeOpacity('', 0)
	draw(State.degree)
}

/**
 Event When Timer Arm Is Grabbed
 */
Query.timerArm.addEventListener('mousedown', timerHandler)

const rect = Query.timerBox.getBoundingClientRect()
const radius = rect.width / 2

function draw(degree) {
	let angle
	const radius = 125
	angle = 360 - degree
	angle %= 360
	const r = (angle * Math.PI) / -180,
		x = Math.sin(r) * radius,
		y = Math.cos(r) * -radius,
		mid = angle > 180 ? 1 : 0, // change this to 0 : 1 to reverse
		anim =
			'M 0 0 v ' +
			-radius +
			' A ' +
			radius +
			' ' +
			radius +
			' 1 ' +
			mid +
			' 0 ' + // change this to 1 to reverse
			x +
			' ' +
			y +
			' z'

	Query.timerCirclePath.setAttribute('d', anim)
}

function timerHandler(event) {
	let rotating = true

	function onRotateStart(e) {
		Interaction.changeOpacity('opacity 0.5s linear 0s', 1)

		draw(Formula.calcLiveDegree(e))
		State.minutes = Formula.calcTotalTime(Formula.calcClosestLiveDegree(e)) // State minutes
		State.degree = Formula.calcClosestLiveDegree(e) // State degree

		rotating ? (Query.timerArm.style.transform = `rotate(${Formula.calcLiveDegree(e)}deg)`) : null
		Query.timerDisplay.textContent = `${Formula.calcTotalTime(Formula.calcClosestLiveDegree(e))}:00`

		console.log('liveDegree: ' + Formula.calcLiveDegree(e))
		console.log('State.degree: ' + State.degree)
		console.log('State.minutes: ' + State.minutes)
		console.log('')
	}

	function onRotateRelease(e) {
		Interaction.changeOpacity('opacity 0.5s linear 0s', 0)

		draw(Formula.calcClosestLiveDegree(e))
		State.minutes = Formula.calcTotalTime(Formula.calcClosestLiveDegree(e)) // State minutes
		State.degree = Formula.calcClosestLiveDegree(e) // State degree

		rotating
			? (event.target.style.transform = `rotate(${Formula.calcClosestLiveDegree(e)}deg)`)
			: null

		rotating = !rotating
		document.removeEventListener('mousemove', onRotateStart)
		document.removeEventListener('mouseup', onRotateRelease)
	}

	document.addEventListener('mousemove', onRotateStart)
	document.addEventListener('mouseup', onRotateRelease)
}

Query.startButton.addEventListener('click', timer)

function timer() {
	Query.startButton.disabled = true
	let minute = State.minutes - 1
	let sec = 59
	let full = -360

	const tickVelocity = 360 / (State.minutes * 60)

	const timer = setInterval(() => {
		let ticked = (full += tickVelocity)

		draw(ticked)
		Query.timerArm.style.transform = `rotate(${ticked}deg)`
		Query.timerDisplay.textContent = minute + ':' + Helper.formatDouble(sec)
		sec--
		if (sec < 0) {
			minute--
			sec = 59
		}
		if (minute < 0) {
			console.log('times up')
			clearInterval(timer)
		}
	}, 1000)
}
function startTimer() {
	console.log('start')
}
