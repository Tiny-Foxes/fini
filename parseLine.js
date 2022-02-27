const FS = require('fs').promises
const INI = require('ini')

exports.parseLine = async (line, value, config) => {
	const isRequireEnabled = config.ignoreRequire !== 'false'

	if (line.startsWith('FINI-') && isRequireEnabled) {
		const specialRequest = line.substring(5)

		switch (specialRequest) {
			case 'requireFile':
			const data = INI.parse(await FS.readFile(`./${value}`, 'utf-8'))

			if (!data.exports) {
				console.warn(`Required file "${specialRequest}" has no [exports] list.`)
				return `${line}=Failed request "${specialRequest}"`
			}

			return INI.stringify(data.exports)
			break
			case 'requireLine': // FINI-requireLine=common.fini-hey-peter
			const data = INI.parse(await FS.readFile(`./${value}`, 'utf-8'))
			return `${line}=${value}`
			break
			default:
			return `${line}=${value}`
			break
		}
	}

	return `${line}=${value}`
}
