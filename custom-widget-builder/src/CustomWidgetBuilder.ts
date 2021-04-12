/*
 * Copyright © 2021 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import {analyzeText, AnalyzeTextResult, transformAnalyzerResult} from "web-component-analyzer";
import {PropertiesInfo} from "./PropertiesInfo";
import {Property} from "./Property";
import {CustomTagHandler} from "./CustomTagHandler";
import * as fs from "fs";
import * as jdenticon from "jdenticon/standalone";

export class CustomWidgetBuilder {

  private wcFile: string = "";
  private outputDir: string = "";

  public generatePropertiesFile(wcFile: string, outputDir: string) {
    this.wcFile = wcFile;
    this.outputDir = outputDir;
    if (!fs.existsSync(this.outputDir)) {
      console.error(`Output directory does not exist: ${this.outputDir}`);
      return;
    }
    try {
      this.createPropertiesFile(this.getPropertiesInfo());
    } catch (e) {
      console.error(e.message);
    }
  }

  private getPropertiesInfo(): PropertiesInfo {
    let analyzeResult = this.analyzeFile();
    if (!analyzeResult) {
      throw new Error(`No properties found in file: ${this.wcFile}`);
    }
    let resultJson = JSON.parse(analyzeResult);
    if (!resultJson || !resultJson.tags[0]) {
      throw new Error(`Cannot get any information from file ${this.wcFile}\nExiting...`);
    }
    let info = resultJson.tags[0];
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
    let output = JSON.stringify(propertiesInfo, null, 2)
    let filePath = `${this.outputDir}/${propertiesInfo.id}.json`;
    fs.writeFileSync(filePath, output);
    console.log(`${filePath} has been generated!`);
  }

  private analyzeFile(): string {
    if (!fs.existsSync(this.wcFile)) {
      throw new Error(`File does not exist: ${this.wcFile}`);
    }
    let fileStr = fs.readFileSync(this.wcFile, "utf8").toString();
    let result: AnalyzeTextResult = analyzeText(fileStr);
    return transformAnalyzerResult("json", result.results, result.program, {visibility: "public"});
  }

  private static getProperties(props: any): Array<Property> {
    if (!props) {
      return [];
    }
    let properties: Array<Property> = [];
    for (let prop of props) {
      if (this.propToExclude(prop.name)) {
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

  /**
   * Get the display name of a web component, or a property
   * e.g.:
   *  pb-input -> Input
   *  wc-example -> WcExample
   *  required -> Required
   *  labelWidth -> Label width
   *  allowHTML -> Allow html
   */
  private static getDisplayName(wcName: string): string {
    let name = wcName.replace(/^(pb-)/,"");
    // camel case to words
    name = CustomWidgetBuilder.fromCamelCase(name);
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

  /**
   * Transform a string to boolean or number
   * e.g. "false" -> false
   *      "4" -> 4
   */
  private static getDefaultValue(value: string): string | number | boolean {
    try {
      return JSON.parse(value);
    } catch (err) {
      return value;
    }
  }

  /**
   * Mapping from web component type to UID type
   *  number -> integer
   *  string -> text
   *  number | undefined -> number
   */
  private static getPropertyType(wcType: string): string {

    if (!wcType) {
      return wcType;
    }
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

  private static propToExclude(propName: string) {
    // "styles" is a reserves word for css with lit-element
    let toExclude = ["styles"];
    return toExclude.indexOf(propName) > -1;
  }
}



