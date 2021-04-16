# bonita-ui-designer-sdk

This sdk provides tooling to build custom widgets for UI Designer.


## Custom Widget Builder 
  
Generates Bonita UI Designer custom widgets from web components.

### Build
```
npm run typescript-compile
```

### Test
```
npm run test
```

### Generating the json properties file

#### Adding tags for UI Designer information

You may add description and component name on the web component itself:
```typescript
/**
 * A simple counter component
 *
 * @element wc-example
 */
export class WcExample extends LitElement {
...
}
```

You may also add specific information to web component properties, so that UI Designer can handle them.
This is done with 'custom tags', which are JSDoc-like tags, and use the '-@tag' notation (e.g. -@bond).

- Binding
  
    Possible values:
    - ``variable`` (bidirectional bond)
    - ``expression`` (dynamic value)
    - ``interpolation``
    - ``constant``
```typescript
  /**
   * -@bond constant
   */
```
- Constraints

    Define a min and/or max value
```typescript
  /**
   * -@constraints {"min": "1", "max": "12"}
   */
```
- Choice values
  
    Define a set of string values for the 'choice' type
```typescript
  /**
   * -@choiceValues {"left"|"top"}
   * @type choice
   */
```
---
NOTE:
'@type' is a regular JSDoc tag, and should always be defined **after** any other custom tag.
---


- showFor
  
    Allows to display/hide a property on a condition
```typescript
  /**
   * -@showFor properties.labelHidden.value === false
   */
```

- label

    Property name displayed in editor's property panel
```typescript
  /**
    * -@label Min value
   */
```
- caption

    Text displayed below the property label
```typescript
  /**
   * -@caption Any variable: <i>myData</i> or <i>myData.attribute</i>
   */
```


The builder is using https://github.com/runem/web-component-analyzer.  
See the section "How to document your components using JSDoc" from its documentation 
for more details about adding information on the component (@element), on its properties (@prop) and events (@fires).
<br><br>

#### Examples of property tags

```typescript
  /**
   * -@label Value min length
   * -@constraints {"min": "0"}
   */
  @property({ attribute: 'min-length', type: Number, reflect: true })
  minLength: number | undefined;
  
   /**
   * Position of the label
   * -@choiceValues {"left"|"top"}
   * -@bond constant
   * -@showFor properties.labelHidden.value === false
   * @type {choice}
   */
  @property({ attribute: 'label-position', type: String, reflect: true })
  labelPosition: string = "top";

   /**
   * Value of the input
   * -@caption Any variable: <i>myData</i> or <i>myData.attribute</i>
   * -@bond variable
   */
  @property({ attribute: 'value', type: String, reflect: true })
  value: string = "";

  /**
   * -@choiceValues {"text"|"number"|"email"|"password"}
   * -@bond constant
   * @type {choice}
  */
  @property({ attribute: 'type', type: String, reflect: true })
  type: string = "text";

```


#### Using the CLI

Usage:

```shell
cwb <web component source file> [outputDir=<directory>]
```

