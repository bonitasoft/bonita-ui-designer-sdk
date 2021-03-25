import {analyzeText, AnalyzeTextResult, transformAnalyzerResult} from "web-component-analyzer";
import fs from "fs";
import {PropertiesInfo} from "./PropertiesInfo.js";
import {Property} from "./Property.js";

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
    return transformAnalyzerResult("json", result.results, result.program, {visibility: "public"});
  }

  private static getProperties(props: any): Array<Property> {
    let properties: Array<Property> = [];
    for (let prop of props) {
      if (prop.name === 'lang') {
        // We don't want to expose the 'lang' property here
        continue;
      }
      let label = CustomWidgetBuilder.getDisplayName(prop.name);
      let name = prop.name;
      let help = prop.description;
      let type = CustomWidgetBuilder.getPropertyType(prop.type);
      let defaultValue = prop.default;
      properties.push(new Property(label, name, type, defaultValue, help));
    }
    return properties;
  }

  private static toCamelCase(wcName: string): string {
    // e.g. pb-input -> pbInput
    return wcName.replace(/-([a-z])/g, (g) => {return g[1].toUpperCase()});

  }

  private static getDisplayName(wcName: string): string {
    // e.g. pb-input -> Input
    // required -> Required
    let name = wcName.replace(/^(pb-)/,"");
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  private static getTemplate(id: string): string {
    // e.g. pbInput -> @pbInput.tpl.html
    return `@${id}.tpl.html`;
  }

  private static generateIcon(): string {
    // TODO
    return "";
  }

  private static getPropertyType(wcType: string): string {
    // Mapping from web component type to UID type
    // number -> integer
    // string -> text
    // e,g, number | undefined -> number

    wcType = wcType.replace(" | undefined","");

    if (wcType === 'number') {
      return 'integer';
    }
    if (wcType === 'string') {
      return 'text';
    }
    return wcType;
  }

}



