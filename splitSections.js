const { writeFile } = require('fs').promises
const { join } = require('path')

exports.splitSections = async (main) => {
    const listStrings = Object.keys(main)
	let finalString = ''

	if (listStrings.length === 0) {
		throw 'main.fini has no lists, aborting.'
	}

	for (let i = 0; i < listStrings.length; i++) {
		const currentList = main[listStrings[i]]
		const currentListLines = Object.keys(currentList)
        const defaultFileContents = '[exports]\n'
        let currentFileContents = defaultFileContents

		if (!currentListLines) {
			console.warn(`${currentList} has no lines, ignoring.`)
			continue
		}

		finalString = finalString + `[${listStrings[i]}]\n` // Start spacing for list lines.

		for (l = 0; l < currentListLines.length; l++) {
			const currentLineName = currentListLines[l]
            const currentLineValue = currentList[currentLineName]

            if (!currentLineValue) {
                finalString = finalString + `${currentLineName}=\n`
            } else {
                currentFileContents = currentFileContents + `${currentLineName}=${currentLineValue}\n`
            }

			if (currentFileContents === defaultFileContents) {
                continue
            }
            
            // finalString + await parseLine(currentLine, currentList[currentLine], config, smPath) + '\n' // Spacing for the next line
		}
        finalString = finalString + `FINI-requireSection=sections/${listStrings[i]}.fini`
        await writeFile(join(__dirname, `/split/sections/${listStrings[i]}.fini`), currentFileContents)
		finalString = finalString + '\n\n' // Spacing for the next list
	}

    await writeFile(join(__dirname, '/split/main.fini'), finalString)
    return true
}
