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
import DoneCallback = jest.DoneCallback;
import {sep} from "path";

const fs = require('fs');
const {exec} = require('child_process');

describe('CLI test', () => {

  let tempDir: string;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(`${os.tmpdir()}${sep}`);
  });

  afterAll(() => {
    fs.rmdirSync(tempDir, {recursive: true});
  });

  test('should return usage when help parameter', async (done) => {
    let command = "node build/src/starter.js --help";
    checkUsage(command, done);
  });

  test('should return version when version parameter', async (done) => {
    exec("grep version package.json", (error: ExecException | null, stdout: string) => {
      expect(stdout).toBeTruthy();
      let versionVal = stdout.split(':')[1].trim();
      let versionQuote = versionVal.split(',')[0];
      let version = versionQuote.substring(1, versionQuote.length - 1);
      let command = "node build/src/starter.js -v";
      exec(command, (error: ExecException | null, stdout: string) => {
        expect(stdout.trim()).toBe(version);
        done();
      });
    });
  });

  test('should handle correct parameters when generating a json properties file', async (done) => {
    let command = "node build/src/starter.js gen-properties " +
      "--webComponentSource test/resources/uid-input.ts " +
      `--outputDir ${tempDir}`;
    execCommand(command, `${tempDir}/uidInput.json has been generated!`, done);
  });

  test('should handle correct parameters when generating a json properties template file', async (done) => {
    let command = "node build/src/starter.js gen-properties-template " +
      "--webComponentName my-web-component " +
      `--outputDir ${tempDir}`;
    execCommand(command, `${tempDir}/myWebComponent.json has been generated!`, done);
  });

  test('should handle correct parameters when generating a widget', async (done) => {
    let command =
      "node build/src/starter.js gen-widget " +
      "--propertiesFile test/resources/uid-input/uidInput.json " +
      "--webComponentBundle test/resources/uid-input/lib/uid-input.es5.min.js " +
      `--outputDir ${tempDir}/widget`;
    execCommand(command, `Widget has been generated in ${tempDir}/widget/widget-Input.zip`, done);
  });

  test('should handle correct parameters when generating a standard widget', async (done) => {
    let command =
      "node build/src/starter.js gen-std-widget " +
      "--propertiesFile test/resources/uid-input/uidInput.json " +
      "--webComponentBundle test/resources/uid-input/lib/uid-input.es5.min.js " +
      `--outputDir ${tempDir}/widget`;
    execCommand(command, `Standard Widget has been generated in ${tempDir}/widget/widget-Input.zip`, done);
  });

  test('should handle correct parameters when duplicating a widget', async (done) => {
    let command =
      `node build/src/starter.js duplicate-widget --srcDir test/resources/uid-input --destDir ${tempDir}/my-input`;
    execCommand(command, `${tempDir}/my-input has been created!`, done);
  });

  test('should return usage when invalid parameter', async (done) => {
    let command = "node build/src/starter.js --invalid";
    checkUsage(command, done);
  });

  test('should return usage when invalid command parameter', async (done) => {
    let command =
      `node build/src/starter.js copy-wc --srcDir test/resources/uid-input --destDir ${tempDir}/my-input --outputDir ${tempDir}`;
    checkUsage(command, done);
  });

  test('should return usage when additional parameter', async (done) => {
    let command = "node build/src/starter.js --help -v";
    checkUsage(command, done);
  });


  function execCommand(command: string, expectedOutput: string, done: DoneCallback) {
    exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
      if (error) {
        console.log(error);
      }
      expect(stderr).toBeFalsy();
      expect(stdout.trim()).toBe(expectedOutput);
      done();
    });
  }

  function checkUsage(command: string, done: DoneCallback) {
    exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
      // stdout or stderr depending the context...
      if (stdout) {
        expect(stdout.includes("Options:")).toBeTruthy();
      } else {
        expect(stderr.includes("Options:")).toBeTruthy();
      }
      done();
    });

  }

})
