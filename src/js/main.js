const extend = (a, b) => {
	return Object.assign(a, b)
}

const SunsetToSunset = (() => {

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

	// Get options set in HTML
	const stsContainer = document.querySelector('template#sts-settings')
	let options = stsContainer != null ? JSON.parse(stsContainer.dataset.settings) : {}
	
	// Merge options with defaults
	options = extend(extend({}, defaults), options)

	const insertBanner = (closing, opening) => {
		const body = document.querySelector('body');
		
		const template = document.querySelector('template#sts-banner')
		const clone = template.content.cloneNode(true)

		const closingElement = clone.querySelector('.sts-closing-time')
		const closingFormat = closingElement.dataset.formatCustom ? JSON.parse(closingElement.dataset.formatCustom) : closingElement.dataset.formatPreset
		closingElement.textContent = closing.toLocaleString(closingFormat)
		
		const openingElement = clone.querySelector('.sts-opening-time')
		const openingFormat = openingElement.dataset.formatCustom ? JSON.parse(openingElement.dataset.formatCustom) : openingElement.dataset.formatPreset
		openingElement.textContent = opening.toLocaleString(openingFormat)

		body.insertBefore(clone, null)
	}

	const DateTime = luxon.DateTime
	const Duration = luxon.Duration

	const now = DateTime.now()
	console.log(`now: ${now.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`)
	
	// Set day of week: zero-based index
	const closingDayNumber = 5
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
		const sunset = DateTime.fromISO(data.results.sunset)

		return sunset
	}
	
	// Get closing sunset
	const getClosingSunset = () => {
		const daysToClosing = closingDayNumber - now.weekday
		const closingDate = DateTime.fromISO(now.plus({
			days: daysToClosing
		})).toString()

		const closingSunset = getSunsetTime(closingDate);

		return closingSunset
	}

	// Get opening sunset
	const getOpeningSunset = () => {
		const daysToOpening = openingDayNumber - now.weekday
		const openingDate = DateTime.fromISO(now.plus({
			days: daysToOpening
		})).toString()

		const openingSunset = getSunsetTime(openingDate);

		return openingSunset
	}
	
	// Get message minutes
	const getMessageDuration = () => {
		let duration = Duration.fromObject(options.messageDuration)
		
		return duration
	}
	
	// Get guard duration
	const getGuardDuration = () => {
		return options.guardDuration
	}
	
	//Get message time
	const getMessageTime = (date) => {
		return date.minus(getMessageDuration())
	}
	
	// Get guard time. `date` is a Luxon DateTime object.
	const getGuardTime = (date, action) => {
		let time
		
		if (action == 'closing') {
			time = date.minus(getGuardDuration())
		}
		
		if (action == 'opening') {
			time = date.plus(getGuardDuration())
		}
		
		return time
	}
	
	const getTimes = async () => {
		const allTimes = Promise.all([
			getClosingSunset(),
			getOpeningSunset()
		])
		
		const times = await allTimes
		
		return times
	}
	
	// Only run if today is Friday or Sabbath
	if ( now.weekday == closingDayNumber || now.weekday == openingDayNumber ) {
		getTimes().then(([closingSunset, openingSunset]) => {
			
			// Set guard times
			const closing = getGuardTime(closingSunset, 'closing')
			const opening = getGuardTime(openingSunset, 'opening')
			
			// Check times

			// Is is during the week before the time to show the banner?
			const beforeBanner = now < getMessageTime(closing)

			// Is it before closing time but the banner should be up?
			const bannerUp = now < closing && now > getMessageTime(closing)
			
			// Is it during the sabbath?
			const duringSabbath = now >= closing && now <= opening && now.weekday >= closingDayNumber
			
			// Is it after sundown on Saturday?
			const afterSabbath = now > opening && now >= openingDayNumber
			
			console.log(`Banner time: ${getMessageTime(closing).toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`)

			console.log(`Closing guard: ${closing.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`)
			console.log(`Closing Sunset: ${closingSunset.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`)

			console.log(`Opening Sunset: ${openingSunset.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`)
			console.log(`Opening guard: ${opening.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`)

			console.log(`Before banner: ${beforeBanner}`)
			console.log(`Banner up: ${bannerUp}`)
			console.log(`During the Sabbath: ${duringSabbath}`)
			console.log(`After Sabbath: ${afterSabbath}`)

			if (beforeBanner) {
				console.log(`During the week.`)

				// Refresh the page when it's time to show the banner.
				const refreshTime = getMessageTime(closing).diff(now, 'milliseconds').toObject();

				if (now < getMessageTime(closing)) {
					setTimeout(() => {
						location.reload()
					}, refreshTime.milliseconds);
				}
			}

			if (bannerUp) {
				console.log('time to show the banner')

				insertBanner(closing, opening)

				// Refresh the page when it's closing time.
				const refreshTime = closing.diff(now, 'milliseconds').toObject();

				if (now < closing) {
					setTimeout(() => {
						location.reload()
					}, refreshTime.milliseconds);
				}
			}

			if (duringSabbath) {

			}
		})
	} else {
		console.log('Sunset to Sunset: Exiting because today is not closing day')
	}

	return options
})()