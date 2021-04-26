# bonita-ui-designer-sdk

This sdk provides tooling to build custom widgets for UI Designer.

## Custom Widget Builder 
  
Generates Bonita UI Designer custom widgets from web components.

### Overview

To generate a Custom Widget:
1. Add JSDoc comments / tags to your web component if necessary
2. Generate the properties file (json)
3. Add UI Designer information to this properties file
4. Generate the Custom Widget

### Building the json properties file

**1. Adding JSDoc comments to provide information (optional)**

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
<br>

**2. Generating the properties file**

Generate the properties file using the CLI (see below).
If the generator cannot get any information to generate the properties file, please consider either adding information to 
your components using JSDoc (see above), or generate a properties file from the web component name.
<br><br>

**3. Adding UI Designer specific information to the json properties file**

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

<br>

### Generating the Custom Widget
Once the properties file is available, you can generate the Custom Widget,
that will be ready to import in the UI Designer.

### Using the CLI

#### Generate properties file:
```shell
cwb gen-properties -webComponentFile <web component source file> [-outputDir <directory>]
```
or
```shell
cwb gen-properties -webComponentName <web component name> [-outputDir <directory>]
```

#### Generate Custom Widget:
```shell
cwb gen-widget -properties <json properties file> [-outputDir <directory>]
```

## Contribute
### Build
```
npm run typescript-compile
```

### Test
```
npm run test
```

