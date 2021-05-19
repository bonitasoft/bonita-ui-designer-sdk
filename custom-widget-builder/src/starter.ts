#!/usr/bin/env node

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

import {CustomWidgetBuilder} from "./CustomWidgetBuilder";
import {WebComponentCopier} from "./WebComponentCopier";
import {CliDefinition} from "./CliDefinition";
import fs from "fs";
import path from "path";

try {
  let cli = new CliDefinition();
  let params = cli.getParams();
  let command = cli.getCommand();
  if (params.outputDir) {
    createDirIfNeeded(<string>params.outputDir);
  }

  switch (command) {
    case CliDefinition.genPropertiesCommand:
    case CliDefinition.genPropertiesCommandAlias:
      new CustomWidgetBuilder().generatePropertyFileFromWcFile(<string>params.webComponentSource, <string>params.outputDir);
      break;
    case CliDefinition.genPropertiesTemplateCommand:
    case CliDefinition.genPropertiesTemplateCommandAlias:
      new CustomWidgetBuilder().generatePropertyFileFromWcName(<string>params.webComponentName, <string>params.outputDir);
      break;
    case CliDefinition.genWidgetCommand:
    case CliDefinition.genWidgetCommandAlias:
      new CustomWidgetBuilder().generateWidget(<string>params.propertiesFile, <string>params.webComponentBundle, <string>params.outputDir);
      break;
    case CliDefinition.copyWcCommand:
    case CliDefinition.copyWcCommandAlias:
      new WebComponentCopier().copyWebComponent(<string>params.srcDir, <string>params.destDir);
      break;
    default:
      console.error("Invalid command: " + command);
  }

  function createDirIfNeeded(dir: string) {
    if (!fs.existsSync(dir)) {
      if (!fs.existsSync(path.dirname(dir))) {
        throw new Error(`Directory does not exist: ${path.dirname(dir)}`);
      }
      fs.mkdirSync(dir);
    }
  }

} catch (error) {
  console.error(error.message);
}
