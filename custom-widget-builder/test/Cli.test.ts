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

import * as os from "os";
import {ExecException} from "child_process";
const fs = require('fs');
const { exec } = require('child_process');

describe('CLI test', () => {

  let tempDir: string;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(os.tmpdir());
  });

  afterAll(() => {
    fs.rmdirSync(tempDir, {recursive: true});
  });

  test('should handle correct parameters when generating a widget', async (done) => {
    let command =
      "sudo build/src/starter.js gen-widget " +
      "--propertiesFile build/test/pbInput.json " +
      "--webComponentBundle test/resources/pb-input/lib/pb-input.es5.min.js " +
      "--outputDir build/widget"
    exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
      if (error) {
        console.log(error);
      }
      expect(stdout.includes("Widget has been generated in build/widget")).toBeTruthy();
      done();
    });
  });

  test('should handle correct parameters when generating a widget', async (done) => {
    let command =
      "node build/src/starter.js gen-widget " +
      "--propertiesFile test/resources/pb-input/pbInput.json " +
      "--webComponentBundle test/resources/pb-input/lib/pb-input.es5.min.js " +
      "--outputDir build/widget "
    exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
      if (error) {
        console.log(error);
      }
      expect(stdout.includes("Widget has been generated in build/widget")).toBeTruthy();
      done();
    });
  });

})
