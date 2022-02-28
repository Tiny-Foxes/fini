const load = async () => {
	console.log('Loading Libs')

	const FS = require('fs').promises
	const INI = require('js-ini')// require('ini')
	const path = require('path')

	console.log('Reading project file.')

	const project = INI.parse(await FS.readFile('./project.inip', 'utf-8'))

	if (!project) {
		throw 'No project.inip file found, aborting.'
	}

	if (!project.config) {
		throw 'No [config] list found, aborting.'
	}

	const config = project.config

	if (!config.languageCode) {
		throw 'No languageCode property found inside [config] list, aborting.'
	}

	const defaultMain = INI.parse(await FS.readFile(path.join(__dirname, '/smtranslation/default/main.fini'), 'utf-8'))
	const fallbackMain = INI.parse(await FS.readFile(path.join(__dirname, '/smtranslation/fallback/main.fini'), 'utf-8'))
	const main = INI.parse(await FS.readFile(path.join(__dirname, '/main.fini'), 'utf-8'))
	const build = require('./build.js').build

	try {

		if (config.smTranslation) {
			await build(defaultMain, config, 'default')
			await build(fallbackMain, config, 'fallback')
		} else {
			await build(main, config)
		}
		console.log('Build complete')
	} catch (e) {
		console.error(e)
		console.warn('Build process failed')
		return false
	}
}

load()