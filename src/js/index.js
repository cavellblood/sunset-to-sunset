const extend = (a, b) => {
	return Object.assign(a, b)
}

const SunsetToSunset = (options) => {

	console.log(`Intializing Sunset to Sunset...`);
	
	// Set default options
	const defaults = {
		storeIsOpen: true,
		showSunsetMessage: false,
		guardDuration: {
			minutes: 30
		},
		messageDuration: {
			minutes: 60
		},
		location: {
			lat: 0,
			long: 0
		}
	}
	
	// Merge options with defaults
	options = extend(extend({}, defaults), options)
	
	const DateTime = luxon.DateTime;
	const Duration = luxon.Duration;

	const now = DateTime.now()
	const today = now.toString()
	
	// Set day of week: zero-based index
	const closingDayNumber = 4
	const openingDayNumber = 6
	
	// Get location coordinates
	const getLocation = () => {
		return options.location;
	}
	
	// Get sunset time for given date and location
	const getSunsetTime = async (date) => {
		const sunsetDate = date.split('T')[0]
		const response = await fetch('https://api.sunrise-sunset.org/json?&lat=' + getLocation().lat + '&lng=' + getLocation().long + '&date=' + sunsetDate + '&formatted=0')
		const data = await response.json();

		return data.results.sunset
	}
	
	// Get closing time
	const getClosingTime = () => {
		const daysToClosing = closingDayNumber - now.weekday
		const closingDate = DateTime.fromISO(now.plus({
			days: daysToClosing
		})).toString()

		const closingTime = getSunsetTime(closingDate);

		return closingTime
	}

	// Get opening time
	const getOpeningTime = () => {
		const daysToOpening = openingDayNumber - now.weekday
		const openingDate = DateTime.fromISO(now.plus({
			days: daysToOpening
		})).toString()

		const openingTime = getSunsetTime(openingDate);

		return openingTime
	}
	
	// Get message minutes
	const getMessageDuration = () => {
		let duration = Duration.fromObject(options.messageDuration)
		
		return duration
	}
	
	// Get guart minutes
	const getGuardMinutes = () => {
		return options.guardMinutes
	}
	
	//Get message time
	const getMessageTime = (date) => {
		return DateTime.fromISO(date).minus(getMessageDuration())
	}
	
	const getGuardTime = (date, action) => {
		let time
		
		if (action == 'closing') {
			time = DateTime.fromISO(date).minus({ minutes: getGuardMinutes() })
		}
		
		if (action == 'opening') {
			time = DateTime.fromISO(date).plus({ minutes: getGuardMinutes() })
		}
		
		return time
	}
	
	const getTimes = async () => {
		const allTimes = Promise.all([
			getClosingTime(),
			getOpeningTime()
		])
		
		const times = await allTimes
		
		return times
	}
	
	// Only run if today is closing day
	if ( now.weekday == closingDayNumber ) {
		getTimes().then(([closingTime, openingTime]) => {
			
			// Set guard times
			const closing = getGuardTime(closingTime, 'closing')
			const opening = getGuardTime(openingTime, 'opening')
			
			// Check times

			// Is is during the week before closing time?
			const duringWeek    = now < closing

			// Is it before closing time but the banner should be up?
			const showBanner = now < closing && now > getMessageTime
			
			// Is it during the sabbath?
			const duringSabbath = now >= closing && now <= opening && now.weekday >= closingDayNumber
			
			// Is it after sundown on Saturday?
			const afterSabbath = now > opening && now >= openingDayNumber

			console.log(now.toString())
			console.log(getMessageTime(closing).toString())
			console.log(duringWeek)
			console.log(showBanner)
			console.log(duringSabbath)
			console.log(afterSabbath)
		})
	}
	
}


SunsetToSunset({
	location: {
		lat: 35.750413,
		long: -87.229406
	},
	messageMinutes: 5 * 60
})

