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
import {CliHandler} from "./CliHandler";

try {
  let cliHandler = new CliHandler(process.argv.slice(2));
  let outputDir = cliHandler.getOutputDir();
  switch (cliHandler.command) {
    case CliHandler.genPropertiesCommand:
      if (cliHandler.hasParam(CliHandler.webComponentFileParam)) {
        new CustomWidgetBuilder().generatePropertyFileFromWcFile(cliHandler.getWcFile(), outputDir);
      } else if (cliHandler.hasParam(CliHandler.webComponentNameParam)) {
        new CustomWidgetBuilder().generatePropertyFileFromWcName(cliHandler.getWcName(), outputDir);
      } else {
        cliHandler.usage();
      }
      break;
    case CliHandler.genWidgetCommand:
      new CustomWidgetBuilder().generateWidgetFromProperties(cliHandler.getPropertiesFile(), outputDir);
      break;
    default:
      cliHandler.usage();
  }
} catch (error) {
  console.log(error.message);
}
