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

let params = process.argv.slice(2);
let wcFile = params[0];
if (!wcFile) {
  usage();
  process.exit(1);
}
let outputDir = ".";
for (let param of params) {
  if (param.startsWith("outputDir")) {
    outputDir = getParameter(param);
  }
}

console.log(`Generating widget for ${wcFile}...\n`);
new CustomWidgetBuilder().generatePropertiesFile(wcFile, outputDir);

function getParameter(param: string): any {
  return param.substr(param.indexOf('=') + 1);
}

function usage() {
  console.log("Usage: cwb <web component source file> [outputDir=<directory>]");
}
