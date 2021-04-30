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
import {WebComponentCopier} from "../src/WebComponentCopier";

const fs = require('fs');

describe('WebComponentCopier', () => {

  let tempDir: string;

  beforeAll(() => {
    tempDir = fs.mkdtempSync(os.tmpdir());
  });

  afterAll(() => {
    fs.rmdirSync(tempDir, {recursive: true});
  });

  test('should copy a web component when a web component directory is given as input', async () => {
    let destDir = `${tempDir}/smart-input`;
    new WebComponentCopier().copyWebComponent("test/resources/pb-input", destDir);

    expect(fs.existsSync(tempDir)).toBeTruthy();

    fs.rmdirSync(destDir, {recursive: true});
  });

  test('should apply replace rules when a web component directory is copied', async () => {
    let destDir = `${tempDir}/smart-input`;
    new WebComponentCopier().copyWebComponent("test/resources/pb-input", destDir);

    let wcSourceFile = "smart-input/src/smart-input.ts";
    let wcSourceFileContent = getFileContent(wcSourceFile);
    expect(wcSourceFileContent.includes("export class SmartInput")).toBeTruthy();

    let propertiesFile = "smart-input/smartInput.json";
    let properties = JSON.parse(getFileContent(propertiesFile));
    expect(properties.id).toBe("smartInput");
    expect(properties.name).toBe("SmartInput");
    expect(properties.template).toBe("@smartInput.tpl.html");

    let packageJsonFile = "smart-input/package.json";
    let packageJson = JSON.parse(getFileContent(packageJsonFile));
    expect(packageJson.name).toBe("smart-input");

    fs.rmdirSync(destDir, {recursive: true});
  });

  function getFileContent(fileName: string): string {
    let filePath = `${tempDir}/${fileName}`;
    expect(fs.existsSync(filePath)).toBeTruthy();
    return fs.readFileSync(filePath, 'utf8');
  }

});
