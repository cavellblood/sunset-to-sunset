import '../css/style.css'

const extend = (a, b) => {
	return Object.assign(a, b)
}

const renderBanner = (closing, opening) => {
	const userDefinedTemplate = document.querySelector('template#sts-banner-template')

	let template
	
	if (userDefinedTemplate) {
		template = userDefinedTemplate
	} else {
		let defaultBannerTemplate = document.createElement("template")
		
		defaultBannerTemplate.innerHTML = `
			<div class="sts-banner">
				Because of religious beliefs our store will be closed over the Sabbath hours.
				Closing on <span class="sts-closing-time"></span> and will re-open on <span class="sts-opening-time"></span>.
			</div>
		`
		template = defaultBannerTemplate
	}

	const banner = template.content.cloneNode(true)

	// Find all closing elements and add formatted times
	const closingElements = banner.querySelectorAll('.sts-closing-time')
	formatTimes(closingElements, closing)

	// Find all opening elements and add formatted times
	const openingElements = banner.querySelectorAll('.sts-opening-time')
	formatTimes(openingElements, opening)
	
	// Insert the banner as the first item on the page.
	document.body.insertBefore(banner, document.body.firstChild)
}

const formatTimes = (elements, time) => {
	const defaultFormats = {
		locale: {
			"weekday": "long",
			"month": "long",
			"hour": "numeric",
			"minute": "numeric",
			"timeZoneName": "short"
		},
		token: "cccc, LLLL d 'at' h:mm a ZZZZ"
	}

	for (let index = 0; index < elements.length; index++) {
		const el = elements[index];
		
		const elFormatToken  = el.dataset.formatToken
		const elFormatLocale = el.dataset.formatLocale
		let formatted
	
		if (elFormatToken) {
			// Use token format first (https://moment.github.io/luxon/#/formatting?id=table-of-tokens)
			formatted = time.toFormat(elFormatToken)
		} else if (elFormatLocale) {
			// Use locale format
			formatted = time.toLocaleString(JSON.parse(elFormatLocale))
		} else {
			formatted = time.toFormat(defaultFormats.token)
		}

		// Set the content of the element to the formatted time.
		el.textContent = formatted
	}
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

	let times = []

	// Get options set in HTML
	const stsContainer = document.querySelector('template#sts-settings')
	let options = stsContainer != null ? JSON.parse(stsContainer.dataset.settings) : {}
	
	// Merge options with defaults
	options = extend(extend({}, defaults), options)

	const DateTime = luxon.DateTime
	const Duration = luxon.Duration

	const now = DateTime.now()

	times.push({
		'Action': 'Current time',
		'Date': now.toLocaleString(DateTime.DATE_FULL),
		'Time': now.toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET),
	})
	
	// Set day of week: zero-based index
	const closingDayNumber = 1
	const openingDayNumber = 2
	
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
			
			times.push({
				'Action': 'Banner up',
				'Date': getMessageTime(closing).toLocaleString(DateTime.DATE_FULL),
				'Time': getMessageTime(closing).toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET),
			})

			times.push({
				'Action': 'Closing guard',
				'Date': closing.toLocaleString(DateTime.DATE_FULL),
				'Time': closing.toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET),
			})

			times.push({
				'Action': 'Closing sunset',
				'Date': closingSunset.toLocaleString(DateTime.DATE_FULL),
				'Time': closingSunset.toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET),
			})

			times.push({
				'Action': 'Opening sunset',
				'Date': openingSunset.toLocaleString(DateTime.DATE_FULL),
				'Time': openingSunset.toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET),
			})

			times.push({
				'Action': 'Opening guard',
				'Date': opening.toLocaleString(DateTime.DATE_FULL),
				'Time': opening.toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET),
			})

			console.table(times)

			let checks = []

			checks.push({ 
				"key": 'Before banner',
			 	"value": beforeBanner
			})
			checks.push({ 
				"key": 'Banner up',
			 	"value": bannerUp
			})
			checks.push({ 
				"key": 'During the Sabbath',
			 	"value": duringSabbath
			})
			checks.push({ 
				"key": 'After Sabbath',
			 	"value": afterSabbath
			})

			console.table(checks)

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

				renderBanner(closing, opening)

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