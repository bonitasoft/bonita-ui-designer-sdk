# Custom Widget Builder

| :warning:  **This tool is dedicated to the next public version of UI Designer**  |
|------------------------------------------------------------------------------|

CLI to generate Bonita UI Designer custom widgets, from web components.

## ➤ Installation

```bash
$ npm install -g @bonitasoft/custom-widget-builder
```

This will install the custom widget builder (cwb) CLI.

### Requirements

Node version 14 (or above) is required to use the CLI.


## ➤ Using the CLI

### Main Usage

```shell
$ cwb --help

cwb <command>

Commands:
  cwb gen-properties           Generate json properties from web component source file  [aliases: genp]
  cwb gen-properties-template  Generate json properties template from web component name  [aliases: genpt]
  cwb gen-widget               Generate a widget  [aliases: genw]
  cwb duplicate-widget         Duplicate an UI Designer standard widget  [aliases: dupw]

Options:
  -h, --help     Show help  [boolean]
  -v, --version  Show version number  [boolean]

```

### Generate properties file
```shell
$ cwb gen-properties --help
cwb gen-properties

Generate json properties from web component source file

Options:
  --webComponentSource, -s  web component source file  [required]
  --outputDir, -o           output directory  [default: "."]
  -h, --help                Show help  [boolean]
  -v, --version             Show version number  [boolean]
```

### Generate properties template file
```shell
$ cwb gen-properties-template --help
cwb gen-properties-template

Generate json properties template from web component name

Options:
  --webComponentName, -n  web component name  [required]
  --outputDir, -o         output directory  [default: "."]
  -h, --help              Show help  [boolean]
  -v, --version           Show version number  [boolean]
```

### Generate a Custom Widget
```shell
$ cwb gen-widget --help
cwb gen-widget

Generate a widget

Options:
  --propertiesFile, -p      json properties file  [required]
  --webComponentBundle, -b  web component bundle file  [required]
  --outputDir, -o           output directory  [default: "."]
  -h, --help                Show help  [boolean]
  -v, --version             Show version number  [boolean]
```

### Duplicate an UI Designer standard widget
```shell
$ cwb dupw --help
cwb duplicate-widget

Duplicate an UI Designer standard widget

Options:
  --srcDir, -s   source directory  [required]
  --destDir, -d  destination directory  [required]
  -h, --help     Show help  [boolean]
  -v, --version  Show version number  [boolean]
```

---

## ➤ Contribute
### Build
```
npm install
npm run build
```

### Test
```
npm run test
```

