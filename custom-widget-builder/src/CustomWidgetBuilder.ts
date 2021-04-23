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
import * as fs from "fs";
import * as jdenticon from "jdenticon/standalone";
import {PropertiesJsonGenerator} from "./PropertiesJsonGenerator";
import {HtmlTemplatesGenerator} from "./HtmlTemplatesGenerator";
import {Bond} from "./Bond";
import {PropertyConstraint} from "./PropertyConstraint";

export class CustomWidgetBuilder {

  private static artifactType = "widget";
  private static artifactOrder = "1";

  public generatePropertyFileFromWcFile(wcFile: string, outputDir: string) {
    let propInfo = this.getPropertiesInfoFromWebComponent(wcFile);
    new PropertiesJsonGenerator(propInfo, outputDir).generate();
  }

  public generatePropertyFileFromWcName(wcName: string, outputDir: string) {
    let id = CustomWidgetBuilder.toCamelCase(wcName);
    let displayName = CustomWidgetBuilder.getDisplayName(wcName);
    let type = CustomWidgetBuilder.artifactType;
    let template = CustomWidgetBuilder.getTemplate(id);
    let order = CustomWidgetBuilder.artifactOrder;
    let icon = CustomWidgetBuilder.generateIcon();
    let description = "<description of the web component>";
    let descriptionA = "<Description of property A>";
    let propertyA = new Property("Property A", "propertyA", "text", "initial value", descriptionA);
    let descriptionB = "<Description of property B>";
    let constraint = new PropertyConstraint("0", "100");
    let propertyB = new Property("Property B", "propertyB", "integer", "0", descriptionB,
      Bond.Variable, constraint);
    let properties = [propertyA, propertyB];
    let propInfo = new PropertiesInfo(id, wcName, displayName, type, template, description, order, icon, properties);

    new PropertiesJsonGenerator(propInfo, outputDir).generate();
  }

  public generateWidgetFromProperties(propertiesFile: string, outputDir: string) {
    let propInfo = this.getPropertiesFromFile(propertiesFile);
    new HtmlTemplatesGenerator(propInfo, outputDir).generate();
    // TODO: Generate zip file
  }

  public getPropertiesInfoFromWebComponent(wcFile: string): PropertiesInfo {
    let analyzeResult = this.analyzeFile(wcFile);
    if (!analyzeResult) {
      throw new Error(this.getNoInformationMessage(wcFile));
    }
    let resultJson = JSON.parse(analyzeResult);
    if (!resultJson || !resultJson.tags[0]) {
      throw new Error(this.getNoInformationMessage(wcFile));
    }
    let info = resultJson.tags[0];
    let wcName = info.name;
    let id = CustomWidgetBuilder.toCamelCase(wcName);
    let displayName = CustomWidgetBuilder.getDisplayName(wcName);
    let type = CustomWidgetBuilder.artifactType;
    let template = CustomWidgetBuilder.getTemplate(id);
    let description = info.description;
    let order = CustomWidgetBuilder.artifactOrder;
    let icon = CustomWidgetBuilder.generateIcon();
    let properties = CustomWidgetBuilder.getProperties(info.properties);

    return new PropertiesInfo(id, wcName, displayName, type, template, description, order, icon, properties);
  }

  private analyzeFile(wcFile: string): string {
    if (!fs.existsSync(wcFile)) {
      throw new Error(`File does not exist: ${wcFile}`);
    }
    let fileStr = fs.readFileSync(wcFile, "utf8").toString();
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
      let help;
      if (prop.description) {
        help = prop.description;
      }
      let name = prop.name;
      let type = CustomWidgetBuilder.getPropertyType(prop.type);
      let defaultValue = CustomWidgetBuilder.getDefaultValue(prop.default);
      let label = CustomWidgetBuilder.getDisplayName(prop.name);
      properties.push(new Property(label, name, type, defaultValue, help));
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
    let name = wcName.replace(/^(pb-)/, "");
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
    wcType = wcType.replace(" | undefined", "");

    switch (wcType) {
      case 'number':
        return 'integer';
      case 'string':
        return 'text';
      default:
        return wcType;
    }
  }

  private static toCamelCase(str: string): string {
    // e.g. pb-input -> pbInput
    return str.replace(/-([a-z])/g, (g) => {
      return g[1].toUpperCase()
    });
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

  private getPropertiesFromFile(propertiesFile: string) {
    let propertiesStr = fs.readFileSync(propertiesFile, "utf8").toString();
    return JSON.parse(propertiesStr);
  }

  private getNoInformationMessage(wcFile: string) {
    return `Cannot get any information from file ${wcFile}\nExiting...`;
  }
}



