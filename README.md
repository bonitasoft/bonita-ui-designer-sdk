# bonita-ui-designer-sdk

This sdk provides tooling to build custom widgets for UI Designer.


## Custom Widget Builder 
  
Generates Bonita UI Designer custom widgets from web components.

### Generating the json properties file

#### Adding custom tags for UI Designer information
You may add specific information to web component properties, so that UI Designer can handle them.
All custom tags is JSDoc-like, using the '-@tag' notation (e.g. -@bond).

---
**NOTE:**
The custom tags should always be defined before any other JSDoc tag.
---

- Binding
```
  /**
   * -@bond constant
   */
```
- Constraints
```
  /**
   * -@constraints {"min": "1", "max": "12"}
   */
```
- Choice values
```
  /**
   * -@choiceValues {"left"|"top"}
   */
```
- showFor
```
  /**
   * -@showFor properties.labelHidden.value === false
   */
```
- label
```
  /**
    * -@label Min value
   */
```
- caption
```
  /**
   * -@caption Any variable: <i>myData</i> or <i>myData.attribute</i>
   */
```



The builder is using https://github.com/runem/web-component-analyzer.
See the section "How to document your components using JSDoc" from its documentation 
for more details about adding information on the component (@element) and its properties (@prop).

