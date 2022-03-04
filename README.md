# fini
Modular .ini translation

## What it is

`fini` uses [`Sdju/js-ini`](https://github.com/Sdju/js-ini) to add additional functions into .ini files and help create and more organized modular space for OutFox translation. 

##### It can also be used to translate any other stepmania based engine which still uses .ini format for translation.

## Usage

- Install [NodeJS](https://nodejs.org/en/) (At least v11)
- Clone this repository somewhere.
- Run `npm i` inside the cloned folder.
- [Configure `project.inip`](#configs)
- Do your work on `main.fini` and run `node load.js` when done.

If you enable smTranslation, then you'll have to edit `smtranslation/default/main.fini` & `smtranslation/fallback/main.fini`, when doing `node load.js` each respective files will be generated on both folders. You can ignore main.fini on the main folder if you enable this setting.

## Configs

- languageCode

Language code is meant to be a exact reference to your language using [ISO-1 Language codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).
This variable is required for the process to work.
This variable defines the name of the built translation files.

- countryCode

Country code is meant to be a exact reference to your specific country language code using [ISO 3166-1 Alpha-2 code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements).
This variable defines the name of the built translation files.

> &#x26a0;&#xfe0f; **StepMania Engine doesn't have proper support for more than 2 letters language files**: Both StepMania and OutFox, as the date of writting this document, do not follow ISO-1 and ISO 3166-1 standards, however, new languages should not abide by non-standards of StepMania Engine quirks. Your language will still be able to be selected and used, however, instead of showing the Language name, it will show the language code and users won't have the game auto-select the language for them. This will later be fixed at least for OutFox, [following this issue](https://github.com/TeamRizu/OutFox/issues/311).

- RTL

RTL reverses all key values when building the translation files. This way, languages that had to translate languages in reverse for StepMania do not have to do this anymore.
This variable is ignored when `split` is true.

- ignoreRequire

This variable makes all FINI- functions get ignored.
This variable is ignored when `split` is true.

- smTranslation

This variable enables a better directory structure to translate StepMania or any StepMania-based Engine. When this is set to true, the program will look for `main.fini` on both `smtranslation/default` and `smtranslation/fallback` folders, and when building, will build on both folders too. The `main.fini` on the root folder will get ignored.
This variable is ignored when `split` is true.

- split

This variable will split each section of `main.fini` into another file inside `split/sections`, a new `main.fini` will be generated inside `split/`. You're then supposed to move any content inside the split folder into either `smtranslation/default`/`smtranslation/fallback` OR to the root folder itself (leave a sections folder inside of the split folder still). _If you change the value of the variable to true, remember to turn it back to false when you no longer want to split files, and to delete any content inside the split folder if you're splitting a different file, as the function won't clear the folders before writting again._

Keys with empty values will not be separated, this is intentional, the program does not handle exporting keys with no value.

## FINI functions

This project introduces special `FINI-` function to be used inside inside the sections:

### FINI-requireSection

```JavaScript
/**
* requireSection returns a section from given file path,
* optional second argument to specify section can be given, 
* otherwise "exports" is the default exported section.
* Usage: FINI-requireSection=arg1 OR FINI-requireSection=arg1--arg2
* Where:
* arg1 = File path to any valid ini file.
* arg2 = File Section, [ini files includes section like this]
*/
```

See usage in [example/requireSection](./example/requireSection/)

Note: requireSection is the only `FINI-` function that also executes `FINI-` functions, that means if you require a section from another file and that section has lines that execute `FINI-` function, they'll also be executed, `FINI-requireLine` and `FINI-requireValue` do not have this feature. (Might be supported in the future if requested)

While this is good, it makes circular references possible, the parser WILL NOT PREVENT THEM, the program will either halt or crash by memory heap overflow.

### FINI-requireLine

```JavaScript
/**
* requireLine returns given line from given file path and given file section.
* Usage: FINI-requireLine=arg1--arg2--arg3
* Where:
* arg1 = File Path to any valid ini file.
* agr2 = File Section, [ini files includes section like this]
* arg3 = Section Line, which line from the given section to export.
*/
```

See usage in [example/requireLine](./example/requireLine/)

### FINI-requireValue

```JavaScript
/**
* requireValue works exactly like requireLine, but you 
* specify the final name of the line on the final argument.
* Usage: FINI-requireValue=arg1--arg2--arg3--arg4
* Where:
* arg1 = File Path to any valid ini file.
* agr2 = File Section, [ini files includes section like this]
* arg3 = Section Line, which line from the given section to export.
* arg4 = The name of the line which will hold value from agr3
*/
```

See usage in [example/requireValue](./example/requireValue/)

## Quirks

- Comments will not be carried over after the build process is done
- Using `FINI-requireSection` to export a section that has a key with empty value will cause the program to halt.
- **"#" comments are NOT supported by default!** After installing the packages, go to node_modules/js-ini/lib/parse.js and edit the line 39 to this:

```JavaScript
if ((line.length === 0) || (line.startsWith(comment)) || line.startsWith('#')) {
```

Then save it, this will make so comments don't crash the program, it's important to note that both types of comments (; and #) will be ignore when building.
