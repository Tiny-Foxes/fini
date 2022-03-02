const FS = require('fs').promises
const INI = require('js-ini')
const Esrever = require('esrever')
const pathModule = require('path')

/**
 * Parses a INI list line
 * @async
 * @param {string} line The line name
 * @param {string} value The line value
 * @param {import('js-ini/lib/interfaces/ini-object').IIniObject} config project.inip
 * @param {'default' | 'fallback'} [smPath] 
 * @returns {string}
 */
exports.parseLine = async (line, value, config, smPath) => {
	const isRequireEnabled = config.ignoreRequire === false
	const isRTLEnabled = config.RTL === true

	if (line.startsWith('FINI-') && isRequireEnabled) {
		const specialRequest = line.substring(5)
		const formatValue = value.split('-')
		const path = formatValue[0]
		const list = formatValue[1]
		const requestedLine = formatValue[2]
		const finalLine = formatValue[3]
		const data = INI.parse(await FS.readFile(smPath ? pathModule.join(__dirname, `/smtranslation/${smPath}/${path}`) : pathModule.join(__dirname, `/${path}`), 'utf-8'))
		const requestedFileList = list ? data[list] : undefined

		switch (specialRequest) {
			case 'requireSection': // FINI-requireSection=common.fini OR FINI-requireSection=common.fini-hey
				/**
				 * requireSection returns a section from given file path,
				 * optional second argument to specify section can be given, 
				 * otherwise "exports" is the default exported section.
				 * Usage: FINI-requireSection=arg1 OR FINI-requireSection=arg1-arg2
				 * Where:
				 * arg1 = File path to any valid ini file.
				 * arg2 = File Section, [ini files includes section like this]
				 */

				const lookForList = list && !!data[list] ? data[list] : data.exports
				const checkForUndefined = Object.values(lookForList).indexOf(undefined)
				if (checkForUndefined !== -1) {
					console.warn(`\n\n${Object.keys(lookForList)[checkForUndefined]}\n\nThis key has a empty value. Lists that includes keys with no value cannot be exported with requireSection.`)
					return `${line}=Failed request ${specialRequest}`
				}

				if (formatValue.length === 2 && !data[list]) {
					console.warn(`Required file ${path} does not have requested list [${list}]`)
					return `${line}=Failed request ${specialRequest}`
				}


				if (!list && !data.exports) {
					console.warn(`Required file "${path}" has no [exports] list.`)
					return `${line}=Failed request ${specialRequest}`
				}

				const linesOfList = Object.keys(lookForList)
				let sectionResult = ''
				for (let l = 0; l < linesOfList.length; l++) { 
					const lineValue = lookForList[linesOfList[l]]
					const lineName = linesOfList[l]

					// This makes FINI- functions work inside sections that are required.
					// Circular references are not protected!
					sectionResult = sectionResult + await this.parseLine(lineName, lineValue, config, smPath) + '\n'
				}

				return sectionResult
			case 'requireLine': // FINI-requireLine=common.fini-hey-peter
				/**
				 * requireLine returns given line from given file path and given file section.
				 * Usage: FINI-requireLine=arg1-arg2-arg3
				 * Where:
				 * arg1 = File Path to any valid ini file.
				 * agr2 = File Section, [ini files includes section like this]
				 * arg3 = Section Line, which line from the given section to export.
				 */

				if (formatValue.length !== 3) {
					console.warn(`Required line ${value} has too many or too little "-"`)
					return `${line}=Failed request ${specialRequest}`
				}

				if (!data[list]) {
					console.warn(`Required list [${list}] not found at file ${path}.`)
					return `${line}=Failed request ${specialRequest}`
				}

				if (!requestedFileList[requestedLine]) {
					console.warn(`Required line ${requestedLine} not found at list ${list} of file ${path}.`)
					return `${line}=Failed request ${specialRequest}`
				}

				return `${requestedLine}=${isRTLEnabled? Esrever.reverse(requestedFileList[requestedLine] || "") : requestedFileList[requestedLine] || ""}`
			case 'requireValue': // FINI-requireLine=common.fini-hey-peter-louis
				/**
				 * requireValue works exactly like requireLine, but you 
				 * specify the final name of the line on the final argument.
				 * Usage: FINI-requireValue=arg1-arg2-arg3-arg4
				 * Where:
				 * arg1 = File Path to any valid ini file.
				 * agr2 = File Section, [ini files includes section like this]
				 * arg3 = Section Line, which line from the given section to export.
				 * arg4 = The name of the line which will hold value from agr3
				 */


				if (formatValue.length !== 4) {
					console.warn(`Required line ${value} has too many or too little "-"`)
					return `${line}=Failed request ${specialRequest}`
				}

				if (!data[list]) {
					console.warn(`Required list [${list}] not found at file ${path}.`)
					return `${line}=Failed request ${specialRequest}`
				}

				if (!requestedFileList[requestedLine]) {
					console.warn(`Required line ${requestedLine} not found at list ${list} of file ${path}.`)
					return `${line}=Failed request ${specialRequest}`
				}

				return `${finalLine}=${isRTLEnabled? Esrever.reverse(requestedFileList[requestedLine] || "") : requestedFileList[requestedLine] || ""}`
			default:
				return `${line}=${isRTLEnabled? Esrever.reverse(value || "") : value || ""}`
		}
	}

	return `${line}=${isRTLEnabled? Esrever.reverse(value) || "" : value || ""}`
}
