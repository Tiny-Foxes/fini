const FS = require('fs').promises
const INI = require('ini')
const Esrever = require('esrever')
exports.parseLine = async (line, value, config) => {
	const isRequireEnabled = config.ignoreRequire === false
	const isRTLEnabled = config.RTL === true

	if (line.startsWith('FINI-') && isRequireEnabled) {
		const specialRequest = line.substring(5)
		const formatValue = value.split('-')
		const path = formatValue[0]
		const list = formatValue[1]
		const requestedLine = formatValue[2]
		const finalLine = formatValue[3]
		const data = INI.parse(await FS.readFile(`./${path}`, 'utf-8'))
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
				 * arg2 = File Section, [many ini files includes section like this]
				 */

				if (formatValue.length === 2) {
					if (!data[section]) {
						console.warn(`Required file ${path} does not have requested section [${section}]`)
						return `${line}=Failed request ${specialRequest}`
					}

					return INI.stringify(data[section])
				}


				if (!data.exports) {
					console.warn(`Required file "${path}" has no [exports] list.`)
					return `${line}=Failed request ${specialRequest}`
				}

				return INI.stringify(data.exports)
			case 'requireLine': // FINI-requireLine=common.fini-hey-peter
				/**
				 * requireLine returns given line from given file path and given file section.
				 * Usage: FINI-requireLine=arg1-arg2-arg3
				 * Where:
				 * arg1 = File Path to any valid ini file.
				 * agr2 = File Section, [many ini files includes section like this]
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

				return `${requestedLine}=${isRTLEnabled? Esrever.reverse(requestedFileList[requestedLine]) : requestedFileList[requestedLine]}`
			case 'requireValue': // FINI-requireLine=common.fini-hey-peter-louis
				/**
				 * requireValue works exactly like requireLine, but you 
				 * specify the final name of the line on the final argument.
				 * Usage: FINI-requireValue=arg1-arg2-arg3-arg4
				 * Where:
				 * arg1 = File Path to any valid ini file.
				 * agr2 = File Section, [many ini files includes section like this]
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

				return `${finalLine}=${isRTLEnabled? Esrever.reverse(requestedFileList[requestedLine]) : requestedFileList[requestedLine]}`
			default:
				return `${line}=${isRTLEnabled? Esrever.reverse(value) : value}`
		}
	}

	return `${line}=${isRTLEnabled? Esrever.reverse(value) : value}`
}
