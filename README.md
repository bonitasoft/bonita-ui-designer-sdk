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

Edit the <web component name>.json generated file, and add information required for the UI Designer.
<br><br>

### Generating the Custom Widget
Once the properties file is available, you can generate the Custom Widget,
that will be ready to import in the UI Designer.

### Using the CLI

#### Generate properties file:
```shell
cwb gen-properties -webComponent <web component source file> [-outputDir <directory>]
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


