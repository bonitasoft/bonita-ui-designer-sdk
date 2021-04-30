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

import fs from "fs";

export class CliHandler {
  public static genPropertiesCommand = "gen-properties";
  public static genWidgetCommand = "gen-widget";
  public static copyWcCommand = "copy-wc";
  public static commands = [CliHandler.genPropertiesCommand, CliHandler.genWidgetCommand, CliHandler.copyWcCommand];

  public static webComponentFileParam = "webComponentFile";
  public static webComponentNameParam = "webComponentName";
  public static propertiesFileParam = "propertiesFile";
  public static outputDirParam = "outputDir";

  public static sourceDirParam = "srcDir";
  public static destDirParam = "destDir";

  public static nbParameters = 2;

  public command: string = "";

  private paramsMap: Map<string, string>;
  private readonly params: Array<string>;

  constructor(params: Array<string>) {
    this.params = params;
    this.checkCommand();
    this.paramsMap = this.getParamsMap();
    this.checkParamsMap();
  }

  public getWcFile(): string {
    return this.getParam(CliHandler.webComponentFileParam);
  }

  public getWcName(): string {
    return this.getParam(CliHandler.webComponentNameParam);
  }

  public getSourceDir(): string {
    return this.getParam(CliHandler.sourceDirParam);
  }

  public getDestDir(): string {
    return this.getParam(CliHandler.destDirParam);
  }

  public getPropertiesFile() {
    let propsFile = this.getParam(CliHandler.propertiesFileParam);
    CliHandler.checkFileExist(propsFile);
    return propsFile;
  }

  public getOutputDir(): string {
    let outputDir = this.paramsMap.get(CliHandler.outputDirParam);
    if (!outputDir) {
      outputDir = ".";
    } else {
      CliHandler.checkDirExist(outputDir);
    }
    return outputDir;
  }

  public usage() {
    console.log("Usage:");
    console.log(`\tcwb ${CliHandler.genPropertiesCommand} --${CliHandler.webComponentFileParam} <web component source file> [--${CliHandler.outputDirParam} <directory>]`);
    console.log(`\tcwb ${CliHandler.genWidgetCommand} --${CliHandler.propertiesFileParam} <json properties file> [--${CliHandler.outputDirParam} <directory>]`);
    console.log(`\tcwb ${CliHandler.copyWcCommand} --${CliHandler.sourceDirParam} <directory> --${CliHandler.destDirParam} <directory>`);
    process.exit(1);
  }

  public hasParam(paramName: string) {
    return this.paramsMap.get(paramName) != undefined;
  }

  private getParamsMap(): Map<string, string> {
    let paramsMap = new Map();
    for (let ii = 1; ii < this.params.length; ii++) {
      let param = this.params[ii];
      let key, value;
      if (param.startsWith('--')) {
        key = param.substring(2);
        ii++;
        value = this.params[ii];
      }
      paramsMap.set(key, value);
    }
    return paramsMap;
  }

  private checkCommand() {
    this.command = this.params[0];
    if (!this.command || !CliHandler.commands.includes(this.command)) {
      this.usage();
    }
  }

  private checkParamsMap() {
    if (this.paramsMap.size > CliHandler.nbParameters) {
      this.usage();
    }
  }

  private getParam(paramName: string): string {
    let param = this.paramsMap.get(paramName);
    if (!param) {
      this.usage();
    }
    return <string>param;
  }

  private static checkDirExist(dir: string) {
    if (!fs.existsSync(dir)) {
      throw new Error(`Directory does not exist: ${dir}`);
    }
  }

  private static checkFileExist(file: string) {
    if (!fs.existsSync(file)) {
      throw new Error(`File does not exist: ${file}`);
    }
  }
}
