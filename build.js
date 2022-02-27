const parseLine = require('./parseLine.js').parseLine
const FS = require('fs').promises

exports.build = async (main, config) => {
	const listStrings = Object.keys(main)
	let finalString = ''

	if (listStrings.length === 0) {
		throw 'main.fini has no lists, aborting.'
	}

	for (let i = 0; i < listStrings.length; i++) {
		const currentList = main[listStrings[i]]
		const currentListLines = Object.keys(currentList)

		if (!currentListLines) {
			console.warn(`${currentList} has no lines, ignoring.`)
			continue
		}

		finalString = finalString + `[${listStrings[i]}]\n` // Start spacing for list lines.

		for (l = 0; l < currentListLines.length; l++) {
			const currentLine = currentListLines[l]

			finalString = finalString + await parseLine(currentLine, currentList[currentLine], config) + '\n' // Spacing for the next line
		}

		finalString = finalString + '\n\n' // Spacing for the next list
	}

	const fileName = () => {
		let name = config.languageCode

		if (config.countryCode !== '') {
			name = name + `-${config.countryCode}`
		}

		return name
	}
	
	await FS.writeFile(`${fileName()}.ini`, finalString)

	return finalString
}