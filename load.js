const load = async () => {
      console.log('Loading Libs')

      const FS = require('fs').promises
      const INI = require('ini')

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

      const main = INI.parse(await FS.readFile('./main.fini', 'utf-8'))

      if (!main) {
            throw 'No main.fini file found, aborting.'
      }

      const build = require('./build.js').build

      try {
            const finalContent = await build(main, config)
            return finalContent
      } catch (e) {
            console.error(e)
            console.warn('Build process failed')
            return false
      }
}

load()