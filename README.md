# Custom Widget Builder

Generates Bonita UI Designer custom widgets from web components, for the following use cases:
- Extend a standard UI Designer widget
- Build a custom widget from a web component built from scratch
- Build a custom widget from a web component of the community

## ➤ Installation

```bash
$ npm install -g bonita-ui-designer-sdk
```

This will install the custom widget builder (cwb) CLI.

---

## ➤ Extend a standard UI Designer widget

To extend an UI Designer widget, you will have to extend its corresponding web component.

To do this, create a git repository
from the [uid-web-components](https://github.com/jeromecambon/uid-web-components) template 
(click on the "Use this template" button).

Then, follow the following steps.

### Create your extended web component
- Clone the created repository on your local machine, and follow its README to install its dependencies
  

- Initialize the repository:
  ```bash
    $ cd components
    $ npm run init
  ```
  
- Duplicate the web component you want to extend, using the cwb CLI.  
  For instance if you want to extend the `pb-input` web component and create `my-input`:
  ```bash
  $ cd packages
  $ cwb copy-wc --srcDir widgets/pb-input --destDir widgets/my-input
  ````
  
- Open the repository in your favorite IDE, and modify your new web component as needed  
For instance, you may want to add a new property to the component.
  

- Build the component
  ```bash
  $ cd components
  $ npm run bundle
  ```
- Test your extended component updating its `index.html` file.

### Build your new custom widget

From your extended web component, you can now build an UI Designer custom widget:

- Update the properties json file. For instance, add a json object for the new property in `myInput.json`.  
For details, see "Building the json properties file" section below.
  

- Generate the custom widget using the CLI:
  ```bash
  $ cd packages
  $ cwb gen-widget --propertiesFile widgets/my-input/myInput.json --webComponentBundle widgets/my-input/lib/my-input.es5.min.js  --outputDir widgets/my-input/uid-widget
  ```
  
Your new custom widget is now ready to be imported in the UI Designer!

---

## ➤ Build a custom widget from a web component built from scratch

### Overview

To generate a Custom Widget:
1. Create your new web component
2. Add JSDoc comments / tags to your web component if necessary
3. Generate the properties file (json)
4. Add UI Designer information to this properties file
5. Generate a web component bundle
6. Generate the Custom Widget

### Creating a new web component

You may use any web component environment to build your web component.

We suggest using [open-wc](https://open-wc.org) recommendations, which provides guides, tools and libraries 
for developing web components.
You can use the [open-wc generator](https://open-wc.org/guides/developing-components/getting-started/),
which prompts you with questions to build your web component project.

### Adding JSDoc comments to provide information (optional)

The builder is using the [Web Component Analyzer tool](https://github.com/runem/web-component-analyzer). 
Depending on how you wrote your web component, the library you used, etc... you may have to add JSDoc comments and tags
to provide information on your web component.

See the section "How to document your components using JSDoc" from the 
[Web Component Analyzer documentation](https://github.com/runem/web-component-analyzer#-how-to-document-your-components-using-jsdoc)
for more details about adding information on the component (@element), on its properties (@prop) and events (@fires).

Here is an example:
```javascript
/**
 * @element bottom-button
 */
class BottomButton extends Polymer.Element {
  static get is() { return 'bottom-button'; }

  static get properties() {
    return {
      /**
       * Define the border of the button
       */
      border: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      }
    };
  }
  ...
}
```


### Generating the properties file

Generate the properties file using the CLI (see below).
If the generator cannot get any information to generate the properties file, please consider either adding information to 
your components using JSDoc (see above), or generate a properties file from the web component name.


### Adding UI Designer specific information to the json properties file

Edit the <web component name>.json generated file, and add to properties objects the information required for the UI Designer.

- Binding

  Possible values:
    - ``variable`` (bidirectional bond)
    - ``expression`` (dynamic value)
    - ``interpolation``
    - ``constant``
    ```json
    "bond": "constant"
    ```
  
- Constraints

  Define a min and/or max value
    ```json
    "constraints": {
      "min": "1",
      "max": "12"
    }
    ```
  
- Choice values

  Define a set of string values for the 'choice' type
    ```json
    "choiceValues": [
      "left",
      "top"
    ]
    ```

- showFor

  Allows to display/hide a property on a condition
    ```json
    "showFor": "properties.labelHidden.value === false"
    ```

- label

  Property name displayed in editor's property panel
    ```json
    "label": "Min value"
    ```

- caption

  Text displayed below the property label
  ```json
  "caption": "Any variable: <i>myData</i> or <i>myData.attribute</i>"
  ```

Example:
```json
  {
    "id": "pbInput",
    "name": "Input",
    "type": "widget",
    "template": "@pbInput.tpl.html",
    "description": "Field where the user can enter information",
    "order": "1",
    "icon": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 20'><g><path fill='#fff' d='M1,19V1h48v18H1z M0,0v20h50V0H0z M6,18v-1H5v1H6z M8,17H7v1h1V17z M7,2v1h1V2H7z M5,3h1V2H5V3z M6,3v14h1 V3H6z '/></g></svg>",
    "properties": [
      {
        "label": "Label position",
        "name": "labelPosition",
        "type": "choice",
        "choiceValues": [
          "left",
          "top"
        ],
        "defaultValue": "top",
        "bond": "constant",
        "showFor": "properties.labelHidden.value === false"
      },
      {
        "label": "Label width",
        "name": "labelWidth",
        "type": "integer",
        "defaultValue": 4,
        "showFor": "properties.labelHidden.value === false",
        "bond": "constant",
        "constraints": {
          "min": "1",
          "max": "12"
        }
      },
      {
        "label": "Value",
        "name": "value",
        "help": "Read-write binding, initialized or updated by users' input (bi-directional bond)",
        "caption": "Any variable: <i>myData</i> or <i>myData.attribute</i>",
        "type": "text",
        "bond": "variable"
      }
    ]
  }

```

### Generating a web component bundle

The web component bundle includes the web component and all its dependencies in a single file.
For example, you may use the [esbuild](https://esbuild.github.io) tool to generate the bundle, with a command such as:
```bash
$ npm install esbuild
$ ./node_modules/.bin/esbuild dist/my-wc.js  --bundle --outfile=my-wc-bundle.js
```


### Generating the Custom Widget

Once the properties file is available, you can generate the Custom Widget using the Custom Widget Builder (cwb) CLI,
that will be ready to import in the UI Designer:
```bash
$ cwb gen-widget --propertiesFile myWc.json --webComponentBundle dist/my-wc-bundle.js --outputDir uid_widget
```
Your new custom widget is now ready to be imported in the UI Designer!

---

## ➤ Build a custom widget from a web component of the community

You may want to get a web component that fit your needs from the community.
In this case, follow these steps:
- Get the web component file or bundle  
For instance, you found a date picker component that you would like to use as a UI designer widget.
  

- Generate a json properties file template, providing only its name
  ```bash
  $ cwb gen-properties --webComponentName date-picker --outputDir date-picker
  ```
  
- From the web component documentation, replace the template properties entries by the actual properties  
  For details, see "Building the json properties file" section.
  

- Generate the custom widget 
  ```bash
  $ cwb gen-widget --propertiesFile date-picker/datePicker.json --webComponentBundle ../../node_modules/@vanillawc/wc-datepicker/dist/wc-datepicker-node.js --outputDir date-picker/uid_widget
  ```

Your new custom widget is now ready to be imported in the UI Designer!

---

## ➤ Using the CLI

#### Generate properties file:
```shell
$ cwb gen-properties --webComponentSource <web component source file> [--outputDir <directory>]
```
or
```shell
$ cwb gen-properties --webComponentName <web component name> [--outputDir <directory>]
```

#### Generate a Custom Widget:
```shell
$ cwb gen-widget --propertiesFile <json properties file> [--outputDir <directory>]
```

#### Copy a web component to a new one:
```shell
$ cwb copy-wc --srcDir <directory> --destDir <directory>
```

---

## ➤ Contribute
### Build
```
npm install
npm run typescript-compile
```

### Test
```
npm run test
```

