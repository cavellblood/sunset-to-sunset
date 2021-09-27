# Sunset to Sunset
This script was developed to help with closing down of a website from sunset on Friday to sunset on Saturday. It displays a banner leading up to the Sabbath notifying visitors of the site when it will not be available.

## Features
- Automatically show a banner on the top of your site notifying visitors when your site will close.
- Show a message during the Sabbath hours letting visitors know why you are closed and when your site will be back online.

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

## Custom Templates
Sunset to sunset has some built-in banner and message templates that will be shown at the appropriate times but sometimes you need to define your own wording. You can do that with the html `template` elements.

### Special Template Tags
You can add the following two tags to your custom templates to render the closing time and the opening times.

#### Closing Time
``` html
<span class="sts-closing-time"></span>
```
#### Opening Time
``` html
<span class="sts-opening-time"></span>
```

### Formatting Times
There are three methods for setting the format on the calculated times in your custom templates:

1. **[Token](#token):** Allows you to set what order each part of the date and time appear so it looks the same for everyone.
2. **[Locale](#locale):** Using whatever the user's browser's date/time format is set to.
3. **[Default](#default):** Basically let the script decide for you.

#### Token
This is the most flexible formatting option as it allows you to define the order of the date/time parts and the formatting. To use the `token` format include the [special closing and opening time tags](#special-template-tags) with a `data-format-token` like the following:
``` html
<span class="sts-closing-time" data-format-token="cccc 'at' h:mm a ZZZZ"></span>

<!-- Output: Monday at 7:44 PM CDT -->
```
> Note that you can add words in the token format by surrounding them with single quotes like in the example above.

**Advanced formatting:** The [Luxon documentation has a full list of formatting tokens](https://moment.github.io/luxon/#/formatting?id=table-of-tokens) so that you can fine-tune your dates and times.

#### Locale
With this option you can't arrange the parts of the date and time but you can decide how they are formatted. To use the `locale` format include the [special closing and opening time tags](#special-template-tags) with a `data-format-locale` like the following:
``` html
<span class="sts-closing-time" data-format-locale='{ 
  "weekday": "long",
  "month": "long",
  "hour": "numeric",
  "minute": "numeric",
  "timeZoneName": "short"
}'></span>

<!-- Output: September Monday, 7:44 PM CDT -->
```

#### Default
Include the [special closing and opening time tags](#special-template-tags) with no `data-format-locale` or `data-format-token` attributes and it will output the times with the token format of `cccc, LLLL d 'at' h:mm a ZZZZ`:
``` html
<span class="sts-closing-time"></span>

<!-- Output: Monday, September 27 at 7:44 PM CDT -->
```

### Banner Template
To define your custom banner template add the following snippet to your page, preferrably in the `<head>` tag.

``` html
<template id="sts-banner-template">
  <div class="sts-banner  YOUR-CUSTOM-CLASSES-HERE">
    Our store will be closing at 
    <span class="sts-closing-time"></span>
    <span>and will re-open on</span>
    <span class="sts-opening-time"></span>
  </div>
</template>
```

### Simple Message Template
If you want to just set a paragraph or two of text to appear during Sabbath then this is the template you'll want to use. 

To define your custom message template add the following snippet to your page, preferrably in the `<head>` tag:
``` html
<template id="sts-message-template">
  <p>
    Your message here
  </p>
</template>
```

### Full Message Template
If you want to have full control over the appearance and layout of the message then you'll want to use the full message template. Everything inside of this template will be output into the `<div class="sts-full-message__container">`. You will need to supply your own custom styling to add padding and centering of your message.

To define your custom message template add the following snippet to your page, preferrably in the `<head>` tag:
``` html
<template id="sts-full-message-template">
  <div class="your-custom-layout-class">
    <div class="your-message-area">
      <h1 class="your-message__heading">Sabbath</h1>
      <p>Message here</p>
    </div>
    <div class="your-custom-time-area">
      <p>
        We will re-open on <strong><span class="sts-opening-time"></span>.</strong>
      </p>
    </div>
  </div>
</template>
```

## Defining the Settings
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

## Settings
You can pass an object of configuration options with the `data-settings` attribute in the template above. The allowed values are as follows:

### `location`
- **Type:** `Object`
- **Default:** `{ "lat": 0, "long": 0 }`
- **Description:** An object defining the latitude and longitude of the location to calculate the sunset times. Both keys `lat` and `long` are expected to be of the `Number` type.
- **Example:**
  ``` json
  "location": {
    "lat": 35.7686615,
    "long": -87.4871698
  }
  ```

### `guardDuration`
- **Type:** `Object`
- **Default:** `{ "minutes": 30 }`
- **Description:** This allows you to set the duration of the guard before and after the Sabbath. Whatever time you set here will determine when your Sabbath message will come up and go down. 
  - It accepts any object of options that can have any of the following keys: `years`, `quarters` (three months), `months`, `weeks`, `days`, `hours`, `minutes`, `seconds`, and `milliseconds`. It's recommended to the smaller units like `hours`, `minutes`, etc. though because otherwise you'll be calculating guard times that are into the next week.
- **Example:** If the sun set on Friday at 8:00pm and on Saturday at 8:02pm this would calculate the closing guard time at 5:15pm on Friday and the opening time at 10:47pm on Saturday:
  ``` json
  "guardDuration": {
    "hours": 2,
    "minutes": 45
  }
  ```

### `bannerDuration`
- **Type:** `Object`
- **Default:** `{ "hours": 3 }`
- **Description:** This allows you to set the duration that the banner will be visible before the Sabbath message appears.
  - It accepts any object of options that can have any of the following keys: `years`, `quarters` (three months), `months`, `weeks`, `days`, `hours`, `minutes`, `seconds`, and `milliseconds`. Generally you will only need to use `hours` and `minutes` though.
- **Example:** This would show the banner 3 hours and 3 minutes before the calculated closing guard time determined by the `guardDuration` option:
  ``` json
  "bannerDuration": {
    "hours": 3,
    "minutes": 30
  }
  ```

### `simulateTime`
- **Type:** `Boolean | String`
- **Default:** `false`
- **Description:** This allows you to simulate the time to see how the plugin works at different times of the week and different times of the day. The accepted values are:
  - `preparation-day`
  - `banner-up`
  - `during-sabbath`
  - `after-sabbath`
- **Example:** This would show the Sabbath message as it would appear during the Sabbath hours.
  ``` json
  "simulateTime": "during-sabbath"
  ```

### `debug`
- **Type:** `Boolean`
- **Default:** `false`
- **Description:** When this is set to `true` it will output the calculated times to the console. **N.B.:** this will only show the calculated times if the current weekday is equal to the Friday or Saturday or if the `simulateTime` setting is not `false`. This is done so that it doesn't need to calculate the sunset times unnessarily during the week.
- **Example:** This would output the calculated times to the console.
  ``` json
  "debug": "true"
  ```