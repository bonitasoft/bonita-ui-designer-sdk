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
import path from "path";
import {PropertiesJsonGenerator} from "./PropertiesJsonGenerator";
import {FwkType, HtmlTemplatesGenerator} from "./HtmlTemplatesGenerator";
import {Bond} from "./Bond";
import {PropertyConstraint} from "./PropertyConstraint";
import {PropertyBuilder} from "./PropertyBuilder";
import {PropertyType} from "./PropertyType";
import {PropertiesInfoBuilder} from "./PropertiesInfoBuilder";
import {Asset} from "./Asset";
import * as pjson from "../package.json";
import * as archiver from "archiver";
import os from "os";

export class CustomWidgetBuilder {

  public generatePropertyFileFromWcFile(wcFile: string, outputDir: string) {
    let propInfo = this.getPropertiesInfoFromWebComponent(wcFile);
    new PropertiesJsonGenerator(propInfo, outputDir).generate(true);
  }

  public generatePropertyFileFromWcName(wcName: string, outputDir: string) {
    let propertyA = new PropertyBuilder("propertyA")
      .type(PropertyType.Text)
      .label("Property A")
      .help("<Description of property A>")
      .defaultValue("initial value")
      .build();
    let propertyB = new PropertyBuilder("propertyB")
      .type(PropertyType.Integer)
      .label("Property B")
      .help("<Description of property B>")
      .defaultValue("0")
      .constraints(new PropertyConstraint("0", "100"))
      .bond(Bond.Variable)
      .build();
    let properties = [propertyA, propertyB];

    let propInfo = new PropertiesInfoBuilder(wcName)
      .description("<description of the web component>")
      .properties(properties)
      .build();

    new PropertiesJsonGenerator(propInfo, outputDir).generate(true);
  }

  public async generateCustomWidget(propertiesFile: string, wcBundle: string, outputDir: string) {
    // Generate a directory tree such as:
    // widgetWc.properties
    // └── resources
    //     ├── assets
    //     │   └── js
    //     │       ├── MyInput.js
    //     │       └── myInput.tpl.runtime.html
    //     ├── myInput.tpl.html
    //     └── widgetWc.json

    let propInfo = CustomWidgetBuilder.getPropertiesFromFile(propertiesFile);
    // Add assets to the json properties file
    propInfo.assets = CustomWidgetBuilder.getAssets(propInfo.id, wcBundle);

    // Generate widget files in a temp directory
    let tempDir = fs.mkdtempSync(os.tmpdir());

    // root dir
    CustomWidgetBuilder.generateWidgetProperties(propInfo.name, tempDir);

    // resources dir
    let resourcesDir = `${tempDir}/resources`;
    fs.mkdirSync(resourcesDir);
    new HtmlTemplatesGenerator(propInfo).generate(resourcesDir, FwkType.AngularJS);
    // Specific id for custom widgets
    let id = propInfo.id;
    propInfo.id = `custom${CustomWidgetBuilder.firstLetterUppercase(propInfo.id)}`;
    new PropertiesJsonGenerator(propInfo, resourcesDir).generate(false, `widgetWc.json`);
    propInfo.id = id;

    // assets/js dir
    let jsDir = `${resourcesDir}/assets/js`;
    fs.mkdirSync(jsDir, {recursive: true});
    CustomWidgetBuilder.copyFile(wcBundle, jsDir);
    new HtmlTemplatesGenerator(propInfo).generate(jsDir, FwkType.Angular);

    let zipFile = `${outputDir}/widget-${propInfo.name}.zip`;
    await CustomWidgetBuilder.generateZip(tempDir, zipFile);
    console.log(`Widget has been generated in ${zipFile}`);
    fs.rmdirSync(tempDir, {recursive: true});

  }

  public generateStandardWidget(propertiesFile: string, outputDir: string) {
    // TODO: for our own widgets: only json properties file and templates are required
  }

  public getPropertiesInfoFromWebComponent(wcFile: string): PropertiesInfo {
    let analyzeResult = CustomWidgetBuilder.analyzeFile(wcFile);
    if (!analyzeResult) {
      throw new Error(CustomWidgetBuilder.getNoInformationMessage(wcFile));
    }
    let resultJson = JSON.parse(analyzeResult);
    if (!resultJson || !resultJson.tags[0]) {
      throw new Error(CustomWidgetBuilder.getNoInformationMessage(wcFile));
    }
    let info = resultJson.tags[0];
    let wcName = info.name;
    let description = info.description;
    let properties = CustomWidgetBuilder.getProperties(info.properties);

    return new PropertiesInfoBuilder(wcName)
      .description(description)
      .properties(properties)
      .build();
  }

  public static toCamelCase(str: string): string {
    // e.g. pb-input -> pbInput
    return str.replace(/-([a-z])/g, (g) => {
      return g[1].toUpperCase()
    });
  }

  public static fromCamelCase(str: string, sep?: string): string {
    // e.g. allowHTML -> Allow html
    if (!sep) {
      sep = ' ';
    }
    return str
      .replace(/([a-z0-9])([A-Z])/g, `$1${sep}$2`)
      .replace(/([A-Z])([A-Z])(?=[a-z])/g, `$1${sep}$2`)
      .toLowerCase();
  }

  public static firstLetterUppercase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private static analyzeFile(wcFile: string): string {
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
      let type;
      if (prop.type) {
        type = CustomWidgetBuilder.getPropertyType(prop.type);
      }
      let defaultValue = CustomWidgetBuilder.getDefaultValue(prop.default);
      properties.push(new PropertyBuilder(name).type(type).defaultValue(defaultValue).help(help).build());
    }
    return properties;
  }

  private static getAssets(wcId: string, wcBundle: string): Array<Asset> {
    let assets: Array<Asset> = [];
    // web component bundle
    let assetBundle: Asset = {
      id: CustomWidgetBuilder.getUUIDv4(),
      name: path.basename(wcBundle),
      type: "js"
    };
    // web component runtime template
    let runtimeTplBundle: Asset = {
      id: CustomWidgetBuilder.getUUIDv4(),
      name: `${wcId}.${HtmlTemplatesGenerator.AngularFileExtension}`,
      type: "js",
      order: 1
    };
    assets.push(assetBundle, runtimeTplBundle);
    return assets;
  }

  private static generateWidgetProperties(wcName: string, outputDir: string) {
    let buff = [];
    buff.push('#Generated by Bonita UI Designer SDK');
    buff.push(`#${new Date().toString()}`);
    buff.push(`name=${wcName}`);
    buff.push(`designerSdkVersion=${pjson.version}`);
    buff.push('contentType=wc-widget');
    let content = buff.join('\n');
    let filePath = `${outputDir}/widgetWc.properties`;
    fs.writeFileSync(filePath, content);
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
  private static getPropertyType(wcType: string): PropertyType {

    wcType = wcType.replace(" | undefined", "");

    switch (wcType) {
      case 'number':
        return PropertyType.Integer;
      case 'string':
        return PropertyType.Text;
      case 'boolean':
        return PropertyType.Boolean;
      default:
        throw new Error(`Unsupported type: ${wcType}`);
    }
  }

  private static propToExclude(propName: string) {
    // "styles" is a reserves word for css with lit-element
    let toExclude = ["styles", "lang"];
    return toExclude.indexOf(propName) > -1;
  }

  private static getPropertiesFromFile(propertiesFile: string): PropertiesInfo {
    let propertiesStr = fs.readFileSync(propertiesFile, "utf8").toString();
    return JSON.parse(propertiesStr);
  }

  private static getNoInformationMessage(wcFile: string) {
    return `Cannot get any information from file ${wcFile}\nExiting...`;
  }

  private static copyFile(file: string, dir: string) {
    let sourceBuff = fs.readFileSync(file);
    let fileName = path.basename(file);
    fs.writeFileSync(`${dir}/${fileName}`, sourceBuff);
  }

  private static getUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private static generateZip(dir: string, zipFile: string): Promise<any> {
    // let output = fs.createWriteStream(zipFile);
    // let archive = archiver.create('zip');
    // output.on('close', function () {
    //   console.log(`Widget has been generated in ${zipFile}`);
    //   fs.rmdirSync(dir, {recursive: true});
    // });
    // archive.on('error', function(err){
    //   throw err;
    // });
    // archive.pipe(output);
    // // append files from a sub-directory, putting its contents at the root of archive
    // archive.directory(dir, false);
    // archive.finalize();


    const archive = archiver.create('zip');
    const stream = fs.createWriteStream(zipFile);

    return new Promise((resolve, reject) => {
      archive
        .directory(dir, false)
        .on('error', err => reject(err))
        .pipe(stream)
      ;

      stream.on('close', () => resolve(1));
      archive.finalize();
    });
  }
}



