import {analyzeText, AnalyzeTextResult, transformAnalyzerResult} from "web-component-analyzer";
import fs from "fs";
import {PropertiesInfo} from "./PropertiesInfo.js";
import {Property} from "./Property.js";
import jdenticon from "jdenticon/standalone";
import {CustomTagHandler} from "./CustomTagHandler.js";

export class CustomWidgetBuilder {

  private wcFile: string = "";
  private outputDir: string = "";

  public generatePropertiesFile(wcFile: string, outputDir: string) {
    this.wcFile = wcFile;
    this.outputDir = outputDir;
    this.createPropertiesFile(this.getPropertiesInfo());
  }

  private getPropertiesInfo(): PropertiesInfo {

    let info = JSON.parse(this.analyzeFile()).tags[0];
    if (!info) {
      throw new Error(`Cannot get any information from file ${this.wcFile}\nExiting...`);
    }
    let wcName = info.name;
    let id = CustomWidgetBuilder.toCamelCase(wcName);
    let name = CustomWidgetBuilder.getDisplayName(wcName);
    let type = "widget";
    let template = CustomWidgetBuilder.getTemplate(id);
    let description = info.description;
    let order = "1";
    let icon = CustomWidgetBuilder.generateIcon();
    let properties = CustomWidgetBuilder.getProperties(info.properties);

    return new PropertiesInfo(id, name, type, template, description, order, icon, properties);
  }

  private createPropertiesFile(propertiesInfo: PropertiesInfo) {
    //TODO replace console.log() by logging
    let output = JSON.stringify(propertiesInfo, null, 2)
    console.log(output);
    let filePath = `${this.outputDir}/${propertiesInfo.id}.json`;
    fs.writeFile(filePath, output, (err) => {
      if (err) {
        console.log(`ERROR: Cannot write properties file ${filePath}`);
        console.log(`[${err.message}]`);
      } else {
        console.log(`${filePath} has been generated!`);
      }
    });
  }

  private analyzeFile(): string {
    let fileStr = fs.readFileSync(this.wcFile, "utf8").toString();
    let result: AnalyzeTextResult = analyzeText(fileStr);
    return transformAnalyzerResult("json", result.results, result.program, {visibility: "private"});
  }

  private static getProperties(props: any): Array<Property> {
    let properties: Array<Property> = [];
    for (let prop of props) {
      if (prop.name === 'lang') {
        // We don't want to expose the 'lang' property here
        continue;
      }
       if (!prop.type) {
         // No type: potentially not a property, or we can't do anything with it...
         continue;
       }
      let customTagHandler;
      let help;
      if (prop.description) {
        help = CustomWidgetBuilder.getHelp(prop.description);
      }
      let name = prop.name;
      let type = CustomWidgetBuilder.getPropertyType(prop.type);
      let defaultValue = CustomWidgetBuilder.getDefaultValue(prop.default);
      customTagHandler = new CustomTagHandler(prop.description);
      let label = customTagHandler.label;
      if (!label) {
        label = CustomWidgetBuilder.getDisplayName(prop.name);
      }
      properties.push(new Property(label, name, type, defaultValue, help,
        customTagHandler.bond, customTagHandler.constraints, customTagHandler.showFor,
        customTagHandler.choiceValues, customTagHandler.caption));
    }
    return properties;
  }

  private static getDisplayName(wcName: string): string {
    // e.g. pb-input -> Input
    // wc-example -> WcExample
    // required -> Required
    // labelWidth -> Label width
    // allowHTML -> Allow html
    let name = wcName.replace(/^(pb-)/,"");
    // camel case to words
    name = CustomWidgetBuilder.fromCamelCase(name);
    // name = name.replace( /([A-Z])/g, " $1" ).toLowerCase();
    // dash notation to camel case
    name = CustomWidgetBuilder.toCamelCase(name);
    // First letter uppercase
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  private static getTemplate(id: string): string {
    // e.g. pbInput -> @pbInput.tpl.html
    return `@${id}.tpl.html`;
  }

  private static generateIcon(): string {
    let randomString = Math.random().toString(36).substring(2, 15);
    return jdenticon.toSvg(randomString, 30);
  }

  private static getDefaultValue(value: string): string | number | boolean {
    // Transform string to boolean or number
    // e.g. "false" -> false
    //      "4" -> 4
    try {
      return JSON.parse(value);
    } catch (err) {
      return value;
    }
  }

  private static getPropertyType(wcType: string): string {
    // Mapping from web component type to UID type
    // number -> integer
    // string -> text
    // e,g, number | undefined -> number

    wcType = wcType.replace(" | undefined","");

    switch (wcType) {
      case 'number':
        return 'integer';
      case 'string':
        return 'text';
      default:
        return wcType;
    }
  }

  private static getHelp(description: string): string | undefined {
    // Help field end at first custom tag
    let help = description.substring(0, description.indexOf(CustomTagHandler.CUSTOM_TAG)).trim();
    if (help.length === 0) {
      return undefined;
    }
  }

  private static toCamelCase(str: string): string {
    // e.g. pb-input -> pbInput
    return str.replace(/-([a-z])/g, (g) => {return g[1].toUpperCase()});
  }

  private static fromCamelCase(str: string): string {
    // e.g. allowHTML -> Allow html
    return str
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1 $2')
      .toLowerCase();
  }

}



