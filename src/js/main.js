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

const renderMessage = (opening) => {
	const userDefinedTemplate = document.querySelector('template#sts-message-template')

	let template

	if (userDefinedTemplate) {
		template = userDefinedTemplate
	} else {
		let defaultMessageTemplate = document.createElement("template")
		defaultMessageTemplate.innerHTML = `
			<div class="sts-full-message__container">

				<div class="sts-layout  sts-modal">
					<div class="sts-layout__item  sts-message-area">
						<h1 class="sts-full-message__heading">Sabbath</h1>
						<p>
							In a world that seems to be spinning faster every day, we choose to stop 
							and rest every Sabbath (Saturday). It’s a day for us to relax, refresh, 
							refocus and worship; worship a God who loved us so much that He built a 
							day of rest into Creation week and then commanded us to keep it 
							(knowing we probably wouldn’t do it otherwise—even though it is for 
							our best good).
						</p>
					</div>
					<div class="sts-layout__item  sts-time-area">
						<p>
							We will re-open on <strong><span class="sts-opening-time"></span>.</strong>
						</p>
					</div>
				</div>
			
			</div>
		`
			
		template = defaultMessageTemplate
	}

	const message = template.content.cloneNode(true)

	// Find all opening elements and add formatted times
	const openingElements = message.querySelectorAll('.sts-opening-time')
	formatTimes(openingElements, opening)

	const html = document.getElementsByTagName('html')[0]
	
	html.classList.add('sts-during-sabbath')
	
	// Insert the message as the last item on the page.
	document.body.insertBefore(message, document.body.firstChild)
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

	// Set day of week: zero-based index
	const closingDayNumber = 5
	const openingDayNumber = 6

	const DateTime = luxon.DateTime
	const Duration = luxon.Duration

	const now = DateTime.now()

	// Keep track of calculated times
	let times = {}

	times["Current Time"] = {
		'Date': now.toLocaleString(DateTime.DATE_FULL),
		'Time': now.toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET),
	}

	const activateSunsetWatch = now.weekday == closingDayNumber || now.weekday == openingDayNumber

	const html = document.getElementsByTagName('html')[0]

	// Hide `html` until we have determined what things need to be rendered.
	if (activateSunsetWatch) {
		html.classList.add('hidden')
	}
	
	// Set default options
	const defaults = {
		guardDuration: {
			minutes: 30
		},
		messageDuration: {
			minutes: 60
		},
		location: {
			lat: 0,
			long: 0
		},
		simulateTime: false,
		debug: false
	}
	
	// Get options set in HTML
	const stsContainer = document.querySelector('template#sts-settings')
	let options = stsContainer != null ? JSON.parse(stsContainer.dataset.settings) : {}
	
	// Merge options with defaults
	options = extend(extend({}, defaults), options)

	if (options.simulateTime) {
		console.warn('%cThe `simulateTime` option is enabled for the Sunset to Sunset plugin. Remember to disable this option once you are done verifying the settings.', 'font-size: 16px')
	}
	
	if (options.debug) {
		console.groupCollapsed(`Sunset to Sunset intialized with the following options:`)
		console.dir(options)
		console.groupEnd()
	}
	
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
	if ( activateSunsetWatch ) {
		getTimes().then(([closingSunset, openingSunset]) => {
			
			// Set guard times
			const closing = getGuardTime(closingSunset, 'closing')
			const opening = getGuardTime(openingSunset, 'opening')

			let duringTheWeek = false
			let bannerUp = false
			let duringSabbath = false
			let afterSabbath = false

			// Check if we are simulating the time
			if (options.simulateTime) {
				switch (options.simulateTime) {
					case 'during-the-week':
						duringTheWeek = true
						break;

					case 'banner-up':
						bannerUp = true
						break;

					case 'during-sabbath':
						duringSabbath = true
						break;

					case 'after-sabbath':
						afterSabbath = true
						break;
						
					default:
						break;
				}
			} else {
				duringTheWeek = now < getMessageTime(closing)
				bannerUp = now < closing && now > getMessageTime(closing)
				duringSabbath = now >= closing && now <= opening && now.weekday >= closingDayNumber
				afterSabbath = now > opening && now >= openingDayNumber
			}
		
			// Is is during the week before the time to show the banner?
			if (duringTheWeek) {
				// Refresh the page when it's time to show the banner.
				const refreshTime = getMessageTime(closing).diff(now, 'milliseconds').toObject();

				setTimeout(() => {
					location.reload()
				}, refreshTime.milliseconds);
			}

			// Is it before closing time but the banner should be up?
			if (bannerUp) {
				renderBanner(closing, opening)

				// Refresh the page when it's closing time.
				const refreshTime = closing.diff(now, 'milliseconds').toObject();

				setTimeout(() => {
					location.reload()
				}, refreshTime.milliseconds);
			}

			// Is it during the sabbath?
			if (duringSabbath) {
				renderMessage(opening)

				// Refresh the page when it's opening time.
				const refreshTime = opening.diff(now, 'milliseconds').toObject();

				setTimeout(() => {
					location.reload()
				}, refreshTime.milliseconds);
			}

			// Is it after sundown on Saturday?
			if (afterSabbath) {

			}

			// Unhide `html` after we determine what things need to be rendered.
			html.classList.remove('hidden')

			if (options.debug) {

				let checks = {
					Enabled: {
						"During the week": duringTheWeek,
						"Banner up": bannerUp,
						"During the Sabbath": duringSabbath,
						"After Sabbath": afterSabbath
					}
				}
	
				console.group(`Sunset to Sunset time checks`)
				console.table(checks)
				console.groupEnd()
	
				times['Banner up'] = {
					'Date': getMessageTime(closing).toLocaleString(DateTime.DATE_FULL),
					'Time': getMessageTime(closing).toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET),
				}
	
				times['Closing guard'] = {
					'Date': closing.toLocaleString(DateTime.DATE_FULL),
					'Time': closing.toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET),
				}
	
				times['Closing sunset'] = {
					'Date': closingSunset.toLocaleString(DateTime.DATE_FULL),
					'Time': closingSunset.toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET),
				}
	
				times['Opening sunset'] = {
					'Date': openingSunset.toLocaleString(DateTime.DATE_FULL),
					'Time': openingSunset.toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET),
				}
	
				times['Opening guard'] = {
					'Date': opening.toLocaleString(DateTime.DATE_FULL),
					'Time': opening.toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET),
				}

				console.group(`Sunset to Sunset times`)
				console.table(times)
				console.groupEnd()
  
			}

		})
	} else {
		console.log('Sunset to Sunset: Exiting because today is not closing day')
	}

	return options
})()