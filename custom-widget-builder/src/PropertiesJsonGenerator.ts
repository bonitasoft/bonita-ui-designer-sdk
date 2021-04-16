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

import {PropertiesInfo} from "./PropertiesInfo";
import * as fs from "fs";

export class PropertiesJsonGenerator {

  private readonly outputDir: string;
  private readonly propertiesInfo: PropertiesInfo;

  constructor(propertiesInfo: PropertiesInfo, outputDir: string) {
    this.outputDir = outputDir;
    this.propertiesInfo = propertiesInfo;
  }

  public generate() {
      let output = JSON.stringify(this.propertiesInfo, null, 2)
      let filePath = `${this.outputDir}/${this.propertiesInfo.id}.json`;
      fs.writeFileSync(filePath, output);
      console.log(`${filePath} has been generated!`);
    }
}



