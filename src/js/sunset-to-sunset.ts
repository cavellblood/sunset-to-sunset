import "../css/style.css";
import { DateTime, Duration } from "luxon";

const renderBanner = (closing, opening) => {
  if (typeof window !== "undefined") {
    const userDefinedTemplate = document.querySelector("#sts-banner-template");

    let template;

    if (userDefinedTemplate) {
      template = userDefinedTemplate;
    } else {
      let defaultBannerTemplate = document.createElement("div");

      defaultBannerTemplate.innerHTML = `
        <div class="sts-banner">
          Because of religious beliefs our store will be closed over the Sabbath hours.
          Closing on <span class="sts-closing-time"></span> and will re-open on <span class="sts-opening-time"></span>.
        </div>
      `;
      template = defaultBannerTemplate;
    }

    const banner = template.firstElementChild.cloneNode(true);

    // Find all closing elements and add formatted times
    const closingElements = banner.querySelectorAll(".sts-closing-time");
    formatTimes(closingElements, closing);

    // Find all opening elements and add formatted times
    const openingElements = banner.querySelectorAll(".sts-opening-time");
    formatTimes(openingElements, opening);

    // Insert the banner as the first item on the page.
    document.body.insertBefore(banner, document.body.firstChild);
  }
};

const renderMessage = (opening) => {
  if (typeof window !== "undefined") {
    const userFullTemplate = document.querySelector(
      "#sts-full-message-template"
    );
    const userSimpleTemplate = document.querySelector("#sts-message-template");
    const userDefinedTemplate = userFullTemplate
      ? userFullTemplate
      : userSimpleTemplate;

    let message;

    if (userDefinedTemplate) {
      message = userDefinedTemplate.firstElementChild.cloneNode(true);
      message = message;
    } else {
      let messageHolder = document.createElement("div");
      messageHolder.innerHTML = `
        <p>
          In a world that seems to be spinning faster every day, we choose to stop 
          and rest every Sabbath (Saturday). It’s a day for us to relax, refresh, 
          refocus and worship; worship a God who loved us so much that He built a 
          day of rest into Creation week and then commanded us to keep it 
          (knowing we probably wouldn’t do it otherwise—even though it is for 
          our best good).
        </p>
      `;

      message = messageHolder;
    }

    let messageTemplate;

    if (userFullTemplate) {
      messageTemplate = document.createElement("div");
      messageTemplate.classList.add("sts-full-message__container");

      messageTemplate.insertBefore(message, null);
    } else {
      let template = document.createElement("div");
      template.innerHTML = `
      <div class="sts-full-message__container">
  
        <div class="sts-layout  sts-modal">
          <div class="sts-layout__item  sts-message-area  relative">
            <h1 class="sts-full-message__heading">Sabbath</h1>
          </div>
          <div class="sts-layout__item  sts-time-area">
            <p>
              We will re-open on <strong><span class="sts-opening-time"></span>.</strong>
            </p>
          </div>
        </div>
      
      </div>
    `;

      messageTemplate = template.firstElementChild.cloneNode(true);

      const messageArea = messageTemplate.querySelector(".sts-message-area");
      messageArea.insertBefore(message, null);
    }

    const html = document.getElementsByTagName("html")[0];

    // Add class to prevent scrolling the page
    html.classList.add("sts-during-sabbath");

    // Find all opening elements and add formatted times
    const openingElements =
      messageTemplate.querySelectorAll(".sts-opening-time");
    formatTimes(openingElements, opening);

    // Insert the messageTemplate as the first item on the page.
    document.body.insertBefore(messageTemplate, document.body.firstChild);
  }
};

const formatTimes = (elements, time) => {
  const defaultFormats = {
    locale: {
      weekday: "long",
      month: "long",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    },
    token: "cccc, LLLL d 'at' h:mm a ZZZZ",
  };

  for (let index = 0; index < elements.length; index++) {
    const el = elements[index];

    const elFormatToken = el.dataset.formatToken;
    const elFormatLocale = el.dataset.formatLocale;
    let formatted;

    if (elFormatToken) {
      // Use token format first (https://moment.github.io/luxon/#/formatting?id=table-of-tokens)
      formatted = time.toFormat(elFormatToken);
    } else if (elFormatLocale) {
      // Use locale format
      formatted = time.toLocaleString(JSON.parse(elFormatLocale));
    } else {
      formatted = time.toFormat(defaultFormats.token);
    }

    // Set the content of the element to the formatted time.
    el.textContent = formatted;
  }
};

export const SunsetToSunset = (() => {
  if (typeof window !== "undefined") {
    console.log(`Initializing Sunset to Sunset...`);

    const now = DateTime.now();

    // Keep track of calculated times
    let times = {};

    times["Current Time"] = {
      Date: now.toLocaleString(DateTime.DATE_FULL),
      Time: now.toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET),
    };

    // Get options set in HTML
    const stsContainer = document.querySelector("#sts-settings");
    let days = {};

    // Mainly for debugging purposes you can set the closing and opening day number
    // so the plugin activates on the day you are testing it for example instead of
    // needing to wait until Friday to test it.
    if (stsContainer.dataset.days) {
      days = JSON.parse(stsContainer.dataset.days);
    }

    // Set day of week: zero-based index
    const dayDefaults = {
      closing: 5,
      opening: 6,
    };

    // Merge days with dayDefaults
    days = Object.assign(Object.assign({}, dayDefaults), days);

    const getClosingDayNumber = () => {
      return days.closing;
    };

    const getOpeningDayNumber = () => {
      return days.opening;
    };

    const activateSunsetWatch =
      now.weekday == getClosingDayNumber() ||
      now.weekday == getOpeningDayNumber();

    // Set default options
    const defaults = {
      guardDuration: {
        minutes: 30,
      },
      bannerDuration: {
        hours: 3,
      },
      location: {
        lat: 0,
        long: 0,
      },
      simulateTime: false,
      debug: false,
    };

    let options = {};

    if (stsContainer.dataset.settings) {
      options = JSON.parse(stsContainer.dataset.settings);
    }

    // Merge options with defaults
    options = Object.assign(Object.assign({}, defaults), options);

    if (options.simulateTime) {
      console.warn(
        "%cThe `simulateTime` option is enabled for the Sunset to Sunset plugin. Remember to disable this option once you are done verifying the settings.",
        "font-size: 16px"
      );
    }

    if (options.debug) {
      console.group(`Sunset to Sunset intialized with the following options:`);
      console.dir(options);
      console.groupEnd();
    }

    // Get location coordinates
    const getLocation = () => {
      return options.location;
    };

    // Get sunset time for given date and location
    const getSunsetTime = async (date) => {
      const sunsetDate = date.split("T")[0];
      const response = await fetch(
        "https://api.sunrise-sunset.org/json?&lat=" +
          getLocation().lat +
          "&lng=" +
          getLocation().long +
          "&date=" +
          sunsetDate +
          "&formatted=0"
      );
      const data = await response.json();
      const sunset = DateTime.fromISO(data.results.sunset);

      return sunset;
    };

    // Get closing sunset
    const getClosingSunset = () => {
      let daysToClosing = getClosingDayNumber() - now.weekday;

      const closingDate = DateTime.fromISO(
        now.plus({
          days: daysToClosing,
        })
      ).toString();

      const closingSunset = getSunsetTime(closingDate);

      return closingSunset;
    };

    // Get opening sunset
    const getOpeningSunset = () => {
      let daysToOpening = getOpeningDayNumber() - now.weekday;

      const openingDate = DateTime.fromISO(
        now.plus({
          days: daysToOpening,
        })
      ).toString();

      const openingSunset = getSunsetTime(openingDate);

      return openingSunset;
    };

    // Get message minutes
    const getBannerDuration = () => {
      let duration = Duration.fromObject(options.bannerDuration);

      return duration;
    };

    // Get guard duration
    const getGuardDuration = () => {
      return options.guardDuration;
    };

    //Get message time
    const getMessageTime = (date) => {
      return date.minus(getBannerDuration());
    };

    // Get guard time. `date` is a Luxon DateTime object.
    const getGuardTime = (date, action) => {
      let time;

      if (action == "closing") {
        time = date.minus(getGuardDuration());
      }

      if (action == "opening") {
        time = date.plus(getGuardDuration());
      }

      return time;
    };

    const getTimes = async () => {
      const allTimes = Promise.all([getClosingSunset(), getOpeningSunset()]);

      const times = await allTimes;

      return times;
    };

    // Only run if today is Friday or Sabbath
    if (activateSunsetWatch || options.simulateTime) {
      let preparationDay = false;
      let bannerUp = false;
      let duringSabbath = false;
      let afterSabbath = false;

      // Check if we are simulating the time
      if (options.simulateTime) {
        switch (options.simulateTime) {
          case "preparation-day":
            preparationDay = true;
            break;

          case "banner-up":
            bannerUp = true;
            break;

          case "during-sabbath":
            duringSabbath = true;
            break;

          case "after-sabbath":
            afterSabbath = true;
            break;

          default:
            break;
        }
      }

      getTimes().then(([closingSunset, openingSunset]) => {
        // Set guard times
        const closing = getGuardTime(closingSunset, "closing");
        const opening = getGuardTime(openingSunset, "opening");

        if (!options.simulateTime) {
          // Set time checks
          preparationDay = now < getMessageTime(closing);
          bannerUp = now > getMessageTime(closing) && now < closing;
          duringSabbath =
            now >= closing &&
            now <= opening &&
            now.weekday >= getClosingDayNumber();
          afterSabbath = now > opening && now >= getOpeningDayNumber();
        }

        // Is is during the week before the time to show the banner?
        if (preparationDay) {
          // Refresh the page when it's time to show the banner.
          const refreshTime = getMessageTime(closing)
            .diff(now, "milliseconds")
            .toObject();

          // Don't refresh if there is a negative refresh time.
          // This conditional is mainly here for when `simulateTime`
          // is set to `preparation-day`.
          if (refreshTime.milliseconds >= 0) {
            setTimeout(() => {
              location.reload();
            }, refreshTime.milliseconds);
          }
        }

        // Is it before closing time but the banner should be up?
        if (bannerUp) {
          renderBanner(closing, opening);

          // Refresh the page when it's closing time.
          const refreshTime = closing.diff(now, "milliseconds").toObject();

          // Don't refresh if there is a negative refresh time.
          // This conditional is mainly here for when `simulateTime`
          // is set to `banner-up`.
          if (refreshTime.milliseconds >= 0) {
            setTimeout(() => {
              location.reload();
            }, refreshTime.milliseconds);
          }
        }

        // Is it during the sabbath?
        if (duringSabbath) {
          renderMessage(opening);

          // Refresh the page when it's opening time.
          const refreshTime = opening.diff(now, "milliseconds").toObject();

          if (refreshTime.milliseconds >= 0) {
            setTimeout(() => {
              location.reload();
            }, refreshTime.milliseconds);
          }
        }

        // Is it after sundown on Saturday?
        if (afterSabbath) {
        }

        if (options.debug) {
          let checks = {
            Enabled: {
              "Preparation day": preparationDay,
              "Banner up": bannerUp,
              "During the Sabbath": duringSabbath,
              "After Sabbath": afterSabbath,
            },
          };

          console.group(`Sunset to Sunset time checks`);
          console.table(checks);
          console.groupEnd();

          times["Banner up"] = {
            Date: getMessageTime(closing).toLocaleString(DateTime.DATE_FULL),
            Time: getMessageTime(closing).toLocaleString(
              DateTime.TIME_WITH_SHORT_OFFSET
            ),
          };

          times["Closing guard"] = {
            Date: closing.toLocaleString(DateTime.DATE_FULL),
            Time: closing.toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET),
          };

          times["Closing sunset"] = {
            Date: closingSunset.toLocaleString(DateTime.DATE_FULL),
            Time: closingSunset.toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET),
          };

          times["Opening sunset"] = {
            Date: openingSunset.toLocaleString(DateTime.DATE_FULL),
            Time: openingSunset.toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET),
          };

          times["Opening guard"] = {
            Date: opening.toLocaleString(DateTime.DATE_FULL),
            Time: opening.toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET),
          };

          console.group(`Sunset to Sunset times`);
          console.table(times);
          console.groupEnd();
        }
      });
    } else {
      console.log("Sunset to Sunset: Exiting because today is not closing day");
    }

    return options;
  }
})();
