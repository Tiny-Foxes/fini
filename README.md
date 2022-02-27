# fini
Modular .ini translation

## What it is

`fini` uses [`npm/ini`](https://github.com/npm/ini) to add additional functions into .ini files and help create and more organized modular space for OutFox translation. 

##### It can also be used to translate any other stepmania based engine which still uses .ini format for translation.

## Usage

- Install [NodeJS](https://nodejs.org/en/) (At least v11)
- Clone this repository somewhere.
- Run `npm i` inside the cloned folder.
- Configure `project.inip`:
```INI
[config]
languageCode=pt # REQUIRED
countryCode=BR # OPTIONAL
RTL=false # OPTIONAL (false by default)
ignoreRequire=false # OPTIONAL (false by default)
```
- Do your work on `main.fini` and run `node load.js` when done.

## FINI functions

This project introduces special `FINI-` function to be used inside inside the sections:

### FINI-requireSection

```JavaScript
/**
* requireSection returns a section from given file path,
* optional second argument to specify section can be given, 
* otherwise "exports" is the default exported section.
* Usage: FINI-requireSection=arg1 OR FINI-requireSection=arg1-arg2
* Where:
* arg1 = File path to any valid ini file.
* arg2 = File Section, [many ini files includes section like this]
*/
```

See usage in [example/requireSection](./example/requireSection/)

### FINI-requireLine

```JavaScript
/**
* requireLine returns given line from given file path and given file section.
* Usage: FINI-requireLine=arg1-arg2-arg3
* Where:
* arg1 = File Path to any valid ini file.
* agr2 = File Section, [many ini files includes section like this]
* arg3 = Section Line, which line from the given section to export.
*/
```

See usage in [example/requireLine](./example/requireLine/)

### FINI-requireValue

```JavaScript
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
```

See usage in [example/requireValue](./example/requireValue/)