# Sunset To Sunset Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## 1.0.4 - 2021-09-27
### Added
- Added `README.md`.
- Added the option to set the closing and opening days via html for debugging purposes.

### Fixed
- Fixed an issue where you really couldn't see what time it would close on the upcoming closing day when simulating the time.

## 1.0.3 - 2021-09-26
### Fixed
- Fixed an issue where the `html` tag was not being hidden once the script had loaded.

## 1.0.2 - 2021-09-26
### Fixed
- Added new build files that should have been in `1.0.1`.

## 1.0.1 - 2021-09-26
### Changed
- Specify Vite port number so that it doesn't conflict with other test projects running on port `3000`.

### Fixed
- Fix an issue where the opening times were being set too soon on the full message template and subsequently not being rendered. ([#3](https://github.com/cavellblood/sunset-to-sunset/issues/3))

## 1.0.0 - 2021-09-23
### Changed
- Initial Release

## 1.0.0-beta.2 - 2021-09-23
### Fixed
- Added build files.

## 1.0.0-beta.1 - 2021-09-23
### Added
- Added a default banner template if no template is defined.
- Allow multiple closing and opening elements to be added to the banner.
- Allow the user to set a custom simple message or a fully custom message template.