/**
 * Loads checks to start the build process, designed for CLI use.
 * @returns {boolean} Based if the build failed or not.
 */
const load = async () => {
	console.log('Loading Libs')

	const FS = require('fs').promises
	const INI = require('js-ini')// require('ini')
	const path = require('path')
	const checkConfig = require('./config.js').config
	console.log('Reading project file.')

	const project = INI.parse(await FS.readFile('./project.inip', 'utf-8'))

	if (!project) {
		throw 'No project.inip file found, aborting.'
	}

	if (!project.config) {
		throw 'No [config] list found, aborting.'
	}

	const config = await checkConfig(project.config)
	const defaultMain = INI.parse(await FS.readFile(path.join(__dirname, '/smtranslation/default/main.fini'), 'utf-8'))
	const fallbackMain = INI.parse(await FS.readFile(path.join(__dirname, '/smtranslation/fallback/main.fini'), 'utf-8'))
	const { splitSections } = require('./splitSections.js')
	const main = INI.parse(await FS.readFile(path.join(__dirname, '/main.fini'), 'utf-8'))
	const build = require('./build.js').build

	try {

		if (config.split) {
			await splitSections(main)
			console.log('Split complete, if this is the only split you want to do, then change the value of split on project.inip to false')
			return true
		}

		if (config.smTranslation) {
			await build(defaultMain, config, 'default')
			await build(fallbackMain, config, 'fallback')
		} else {
			await build(main, config)
		}
		console.log('Build complete')
		return true
	} catch (e) {
		console.error(e)
		console.warn('Build process failed')
		return false
	}
}


try {
	load()
} catch (e) {
	console.error(e)
	console.log('\n\nCheck your project.inip and make sure things are correct.')
}