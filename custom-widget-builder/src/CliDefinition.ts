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

import yargs from "yargs";

export class CliDefinition {

  public static genPropertiesCommand = "gen-properties";
  public static genPropertiesCommandAlias = "genp";
  public static genPropertiesTemplateCommand = "gen-properties-template";
  public static genPropertiesTemplateCommandAlias = "genpt";
  public static genWidgetCommand = "gen-widget";
  public static genWidgetCommandAlias = "genw";
  public static genStandardWidgetCommand = "gen-std-widget";
  public static genStandardWidgetCommandAlias = "genstdw";
  public static duplicateWidgetCommand = "duplicate-widget";
  public static duplicateWidgetCommandAlias = "dupw";

  public static webComponentSourceParam = "webComponentSource";
  public static webComponentNameParam = "webComponentName";
  public static webComponentBundleParam = "webComponentBundle";
  public static propertiesFileParam = "propertiesFile";
  public static outputDirParam = "outputDir";

  public static sourceDirParam = "srcDir";
  public static destDirParam = "destDir";

  private yargsParams = yargs
    .alias('h', 'help')
    .help('help')
    .alias('v', 'version')
    .locale('en_US')
    .command([CliDefinition.genPropertiesCommand, CliDefinition.genPropertiesCommandAlias],
      'Generate json properties from web component source file', () => {
        return yargs
          .option(
            CliDefinition.webComponentSourceParam, {
              alias: 's',
              demandOption: true,
              description: 'web component source file'
            })
          .option(
            CliDefinition.outputDirParam, CliDefinition.getOutputDirDef())
      })
    .command([CliDefinition.genPropertiesTemplateCommand, CliDefinition.genPropertiesTemplateCommandAlias],
      'Generate json properties template from web component name', () => {
        return yargs
          .option(
            CliDefinition.webComponentNameParam, {
              alias: 'n',
              demandOption: true,
              description: 'web component name'
            })
          .option(
            CliDefinition.outputDirParam, CliDefinition.getOutputDirDef())
      })
    .command([CliDefinition.genWidgetCommand, CliDefinition.genWidgetCommandAlias],
      'Generate a widget', () => {
        return yargs
          .option(
            CliDefinition.propertiesFileParam, {
              alias: 'p',
              demandOption: true,
              description: 'json properties file'
            })
          .option(
            CliDefinition.webComponentBundleParam, {
              alias: 'b',
              demandOption: true,
              description: 'web component bundle file'
            })
          .option(
            CliDefinition.outputDirParam, CliDefinition.getOutputDirDef())
      })
    .command([CliDefinition.genStandardWidgetCommand, CliDefinition.genStandardWidgetCommandAlias],
      false, () => {
        return yargs
          .option(
            CliDefinition.propertiesFileParam, {
              alias: 'p',
              demandOption: true,
              description: 'json properties file'
            })
          .option(
            CliDefinition.webComponentBundleParam, {
              alias: 'b',
              demandOption: true,
              description: 'web component bundle file'
            })
          .option(
            CliDefinition.outputDirParam, CliDefinition.getOutputDirDef())
      })
    .command([CliDefinition.duplicateWidgetCommand, CliDefinition.duplicateWidgetCommandAlias],
      'Duplicate an UI Designer standard widget', () => {
        return yargs
          .option(
            CliDefinition.sourceDirParam, {
              alias: 's',
              demandOption: true,
              description: 'source directory'
            })
          .option(
            CliDefinition.destDirParam, {
              alias: 'd',
              demandOption: true,
              description: 'destination directory'
            })
      })
    .strict()
    .wrap(null)
    .demandCommand(1, '')
    .argv

  public getParams() {
    return this.yargsParams;
  }

  public getCommand() {
    return this.yargsParams._[0];
  }

  private static getOutputDirDef() {
    return {
      alias: 'o',
      default: '.',
      description: 'output directory'
    }
  }

}
