const ISO = require('i18n-iso-countries')
exports.config = async (config) => {
    if (!config.languageCode) {
        throw 'The variable "languageCode" inside project.inip cannot be empty.'
    }

    const languageCode = config.languageCode

    if (!ISO.getSupportedLanguages().includes(languageCode)) {
        console.warn(`${languageCode} does not follow ISO-1 standard!\n\nReference: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes`)
    }

    const countryCode = config.countryCode
    
    if (countryCode && !ISO.isValid(countryCode)) {
        console.warn(`${countryCode} does not follow ISO 3166-1 Alpha 2 standard!\n\nReference: https://en.wikipedia.org/wiki/ISO_3166-1#Officially_assigned_code_elements`)
    }

    return config
}