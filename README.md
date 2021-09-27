# Sunset to Sunset
This script was developed to help with closing down of a website from sunset on Friday to sunset on Saturday. It displays a banner leading up to the Sabbath notifying visitors of the site when it will not be available.

## Dependencies
The Sunset to Sunset script is dependent on a date time library called [Luxon](https://moment.github.io/luxon/#/) to calculate closing and opening times based off of the sunset times at the location that is entered. A goal is to eventually include this in the Sunset to Sunset script to avoid the need to load two separate scripts.

## Installation
Whichever method you choose, either **Download** or **CDN**, it’s best to include all these files in the head so that they load right away. It’s not ideal to have render-blocking scripts in the head but the reason we recommend putting them in the head is to avoid the flash of the rendered page before the Sabbath message gets rendered. Feel free to submit a PR for improved installation methods.

### Download
- **CSS**
  - [sunset-to-sunset.css](https://unpkg.com/sunset-to-sunset@1.0.3/dist/assets/sunset-to-sunset.css), minified
- **Javascript**
  - [luxon.min.js](https://cdn.jsdelivr.net/npm/luxon@2.0.2/build/global/luxon.min.js), minified library for working with dates and times in JavaScript.
  - [polyfills-legacy.53eda98a.js](https://unpkg.com/sunset-to-sunset@1.0.3/dist/assets/polyfills-legacy.53eda98a.js), legacy bundle for outdated browser support.
  - [sunset-to-sunset.min.js](https://unpkg.com/sunset-to-sunset@1.0.3/dist/assets/sunset-to-sunset.min.js), minified
  - [sunset-to-sunset-legacy.min.js](https://unpkg.com/sunset-to-sunset@1.0.3/dist/assets/sunset-to-sunset-legacy.min.js), minified for legacy browsers

``` html
<!DOCTYPE html>
<html lang="en">

<head>
	<!-- ... -->

	<!-- Luxon library -->
	<script src="YOUR/PATH/HERE/luxon.min.js"></script>
	
	<!-- Safari 10.1 `nomodule` fix script (https://gist.github.com/samthor/64b114e4a4f539915a95b91ffd340acc) -->
	<!-- This can be omitted if you don't have many users of Safari 10.1 in your target audience. -->
	<script>
		!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();
	</script>

	<!-- Legacy bundle for outdated browser support. -->
	<script type="nomodule" src="YOUR/PATH/HERE/polyfills-legacy.53eda98a.js"></script>

	<!-- Sunset to Sunset javascript -->
	<script type="module" src="YOUR/PATH/HERE/sunset-to-sunset.min.js" crossorigin></script>

	<!-- Sunset to Sunset stylesheet -->
	<link href="YOUR/PATH/HERE/sunset-to-sunset.css" rel="stylesheet" media="print" onload="this.media='all'">
	
	<!-- Sunset to Sunset javascript for legacy browsers -->
	<script type="nomodule" src="YOUR/PATH/HERE/sunset-to-sunset-legacy.min.js"></script>
  </head>

<body>
```

### CDN
Link directly to the Sunset to Sunset files on [unpkg](https://unpkg.com/).
``` html
<!DOCTYPE html>
<html lang="en">

<head>
	<!-- ... -->

	<!-- Luxon library -->
	<script src="https://cdn.jsdelivr.net/npm/luxon@2.0.2/build/global/luxon.min.js"></script>
	
	<!-- Safari 10.1 `nomodule` fix script (https://gist.github.com/samthor/64b114e4a4f539915a95b91ffd340acc) -->
	<!-- This can be omitted if you don't have many users of Safari 10.1 in your target audience. -->
	<script>
		!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();
	</script>

	<!-- Legacy bundle for outdated browser support. -->
	<script type="nomodule" src="https://unpkg.com/sunset-to-sunset@1.0.3/dist/assets/polyfills-legacy.53eda98a.js"></script>

	<!-- Sunset to Sunset javascript -->
	<script type="module" src="https://unpkg.com/sunset-to-sunset@1.0.3/dist/assets/sunset-to-sunset.min.js" crossorigin></script>

	<!-- Sunset to Sunset stylesheet -->
	<link href="https://unpkg.com/sunset-to-sunset@1.0.3/dist/assets/sunset-to-sunset.css" rel="stylesheet" media="print" onload="this.media='all'">
	
	<!-- Sunset to Sunset javascript for legacy browsers -->
	<script type="nomodule" src="https://unpkg.com/sunset-to-sunset@1.0.3/dist/assets/sunset-to-sunset-legacy.min.js"></script>
  </head>

<body>
```


## Usage
Sunset to sunset needs some initial configuration needed for it to work correctly for your location. It will work out of the box without configuration but it won't be for your location.

### Defining the Settings
The settings are defined with an html `template` element. The template must have an `id` of `sts-settings` and the data attribute `data-settings` like below:

``` html
<template 
	id="sts-settings" 
	data-settings='{
		"location": {
			"lat": 35.7686615,
			"long": -87.4871698
		}
}'></template>
```

> **N.B.:** the `data-settings` attribute must be valid JSON. Keys need to be quoted, for example `"location":`. The attribute value uses single quotes ', but the JSON entities use double-quotes ".

### Settings
You can pass an object of configuration options with the `data-settings` attribute in the template above. The allowed values are as follows:

#### `location`
- **Type**: `Object`
- **Default**: `{}`

##### `location.lat`
- **Type**: `Number`




|||
|---|---|
| Type | `Object` |

| Name | Type | Default | Description |
|---|---|---|---|
| `location` | `Object` | `{ "lat": 0, "long": 0 }` | An object containing the keys `lat` and `long`. |
| `guardDuration` | `Object` | `{ "minutes": 30 }` | Any object of options that can be provided to [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) |
| `messageDuration` | `Object` | `{ "minutes": 30 }` | Any object of options that can be provided to [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) |
|  |  |  |  |
|  |  |  |  |





