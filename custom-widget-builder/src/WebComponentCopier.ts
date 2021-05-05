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

import * as fs from "fs";
import {CustomWidgetBuilder} from "./CustomWidgetBuilder";
import path from "path";
import {CliHandler} from "./CliHandler";

export class WebComponentCopier {

  private oldWcName: string = "";
  private newWcName: string = "";
  private replaceRules: Array<Array<string>> = [];
  private static directoriesToIgnore = ["build", "lib", "node_modules"];

  private rootDir = true;

  public copyWebComponent(srcDir: string, destDir: string) {
    if (!fs.existsSync(srcDir)) {
      throw Error(`Source directory ${srcDir} does not exist!`);
    }
    if (fs.existsSync(destDir)) {
      throw Error(`Destination directory ${destDir} already exist!`);
    }
    this.oldWcName = path.basename(srcDir);
    this.newWcName = path.basename(destDir);
    this.replaceRules = this.getReplaceRules();

    this.copyFolderRecursiveSync(srcDir, destDir);
    console.log(`${destDir} has been created!`);
  }

  private copyFolderRecursiveSync(source: string, target: string) {
    let files = [];
    // Check if folder needs to be created or integrated
    // We don't want to copy the root source dir in the target
    let targetFolder = target;
    if (!this.rootDir) {
      targetFolder = path.join(target, path.basename(source));
    } else {
      this.rootDir = false;
    }
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder);
    }
    // Copy
    if (fs.lstatSync(source).isDirectory()) {
      files = fs.readdirSync(source);
      for (let file of files) {
        let curSource = path.join(source, file);
        if (fs.lstatSync(curSource).isDirectory()) {
          if (WebComponentCopier.directoriesToIgnore.includes(path.basename(curSource))) {
            continue;
          }
          this.copyFolderRecursiveSync(curSource, targetFolder);
        } else {
          this.copyFileSync(curSource, targetFolder);
        }
      }
    }
  }

  private copyFileSync(source: string, target: string) {
    let targetFile = target;
    // If target is a directory, a new file with the same name will be created
    if (fs.existsSync(target)) {
      if (fs.lstatSync(target).isDirectory()) {
        // Replace file name if it match wcName
        targetFile = path.join(target, this.replaceAll(path.basename(source)));
      }
    }
    let sourceBuff = fs.readFileSync(source).toString();
    let replacedBuff = this.replaceAll(sourceBuff);
    if (path.basename(targetFile) === "package.json") {
      replacedBuff = this.updatePackageJsonScripts(replacedBuff);
    }
    fs.writeFileSync(targetFile, replacedBuff);
  }

  private replaceAll(str: string): string {
    for (let replaceRule of this.replaceRules) {
      str = str.replace(new RegExp(replaceRule[0], 'g'), replaceRule[1]);
    }
    return str;
  }

  private getReplaceRules() {
    // pb-input -> pbInput
    let oldCamelCase = CustomWidgetBuilder.toCamelCase(this.oldWcName);
    let newCamelCase = CustomWidgetBuilder.toCamelCase(this.newWcName);
    // pbInput -> Input
    let oldDisplayName = oldCamelCase.substring(2);
    let newDisplayName = CustomWidgetBuilder.firstLetterUppercase(newCamelCase);
    // pbInput -> PbInput
    let oldCamelCaseUpper = CustomWidgetBuilder.firstLetterUppercase(oldCamelCase);
    let newCamelCaseUpper = CustomWidgetBuilder.firstLetterUppercase(newCamelCase);

    let rules = [];
    // Rule: replace @bonitasoft/pb-input -> pb-input
    rules.push([`@bonitasoft/${this.oldWcName}`, this.oldWcName]);

    // Rule: replace pb-input -> my-input
    rules.push([this.oldWcName, this.newWcName]);

    // Rule: replace PbInput -> MyInput
    rules.push([oldCamelCaseUpper, newCamelCaseUpper]);

    // Rule: replace pbInput -> myInput
    rules.push([oldCamelCase, newCamelCase]);

    // Rule: replace "Input" -> "MyInput"
    rules.push([`"${oldDisplayName}"`, `"${newDisplayName}"`]);

    return rules;
  }

  private updatePackageJsonScripts(buff: string) {
    // Add 'cwb gen-widget' in package.json scripts
    // e.g. :
    // "gen-widget": "cwb gen-widget --propertiesFile myInput.json --webComponentBundle lib/my-input.es5.min.js --outputDir uid_widget"

    let wcNameCamelCase = CustomWidgetBuilder.toCamelCase(this.newWcName);
    let genWidgetCommand =
      `"${CliHandler.genWidgetCommand}": "cwb ${CliHandler.genWidgetCommand} --${CliHandler.propertiesFileParam} ${wcNameCamelCase}.json --${CliHandler.webComponentBundleParam} lib/${this.newWcName}.es5.min.js --${CliHandler.outputDirParam} uid_widget"`;

    // Insert command after '"scripts": {'
    let scriptsObj = "\"scripts\": {";
    let afterScriptsIndex = buff.indexOf(scriptsObj) + scriptsObj.length;

    return buff.slice(0, afterScriptsIndex) + "\n\t" + genWidgetCommand + "," + buff.slice(afterScriptsIndex);
  }

}
