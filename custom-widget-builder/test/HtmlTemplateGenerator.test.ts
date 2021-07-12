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

import {CustomWidgetBuilder} from "../src/CustomWidgetBuilder";
import {HtmlTemplatesGenerator} from "../src/HtmlTemplatesGenerator";
import * as os from "os";
import {sep} from "path";

const fs = require('fs');

describe('HtmlTemplateGenerator', () => {

  let builder: CustomWidgetBuilder;
  let tempDir: string;
  const wcBundle = "test/resources/uid-input/lib/uid-input.es5.min.js";

  beforeAll(() => {
    builder = new CustomWidgetBuilder();
    tempDir = fs.mkdtempSync(`${os.tmpdir()}${sep}`);
  });

  afterAll(() => {
    fs.rmdirSync(tempDir, {recursive: true});
  });

  test('should generate correct html templates when a simple web component is given as input', async () => {
    handleSimpleWC("WcExample.ts");
  });

  test('should generate correct html templates when a complex web component is given as input', async () => {
    let jsonProperties = JSON.parse(fs.readFileSync("test/resources/my-input/myInput.json"));
    let tmplGenerator = new HtmlTemplatesGenerator(jsonProperties);
    tmplGenerator.generate(tempDir);

    // AngularJS template
    let templateAngularJs = getFileContent(`myInput.${HtmlTemplatesGenerator.AngularJsFileExtension}`);
    expect(getStringOccurrences(templateAngularJs, "<my-input")).toBe(4);
    expect(getStringOccurrences(templateAngularJs, "<\/my-input>")).toBe(4);
    expect(getStringOccurrences(templateAngularJs, "ng-if")).toBe(4);
    let expectedPropsAngularJs = ["ng-required=\"properties.required\"", "ng-readonly=\"properties.readOnly\"",
    "ng-if=\"!properties.disabled && properties.labelHidden\"\n\tlabel-hidden", "ng-if=\"!properties.disabled && !properties.labelHidden\"\n\tng-required",
    "label-position=\"{{properties.labelPosition}}\""];
    checkStringContains(templateAngularJs, expectedPropsAngularJs);

    // Angular template
    let templateAngular = getFileContent(`myInput.${HtmlTemplatesGenerator.AngularFileExtension}`);
    expect(getStringOccurrences(templateAngular, "\\*ngIf")).toBe(4);
    let expectedPropsAngular = ["[required]=\"properties.required\"", "[readonly]=\"properties.readOnly\"",
      "*ngIf=\"!properties.disabled && properties.labelHidden\"\n\tlabel-hidden", "*ngIf=\"!properties.disabled && !properties.labelHidden\"\n\t[required]",
      "label-position=\"{{properties.labelPosition}}\"", "[(value)]=\"properties.value\""];
    checkStringContains(templateAngular, expectedPropsAngular);
  });

  test('should generate correct html templates when a JavaScript web component is given as input', async () => {
    handleSimpleWC("WcExample2.js");
  });

  test('should generate correct html templates when a standard web component is given as input', async () => {
    // Standard web component (i.e. extending HTMLElement)
    let tmplGenerator = new HtmlTemplatesGenerator(builder.getPropertiesInfoFromWebComponent("test/resources/app-drawer.js"));
    tmplGenerator.generate(tempDir);

    // AngularJS template
    let templateAngularJs = getFileContent(`appDrawer.${HtmlTemplatesGenerator.AngularJsFileExtension}`);
    let expectedPropsAngularJs = ["open=\"{{properties.open}}\"", "disabled=\"{{properties.disabled}}\""];
    checkStringContains(templateAngularJs, expectedPropsAngularJs);
    // Angular template
    let templateAngular = getFileContent(`appDrawer.${HtmlTemplatesGenerator.AngularFileExtension}`);
    let expectedPropsAngular = ["[open]=\"properties.open\"", "[disabled]=\"properties.disabled\""];
    checkStringContains(templateAngular, expectedPropsAngular);
  });

  function handleSimpleWC(wcFilename: string) {
    let wcNameLowercase = getWcFileLowercase(wcFilename);
    let tmplGenerator = new HtmlTemplatesGenerator(builder.getPropertiesInfoFromWebComponent(`test/resources/${wcFilename}`));
    tmplGenerator.generate(tempDir);

    // AngularJS template
    let templateAngularJs = getFileContent(`${wcNameLowercase}.${HtmlTemplatesGenerator.AngularJsFileExtension}`);
    expect(templateAngularJs.includes(HtmlTemplatesGenerator.ifDirectiveAngularJS)).toBeFalsy();
    let expectedPropsAngularJs = ["title=\"{{properties.title}}\"", "counter=\"{{properties.counter}}\""];
    checkStringContains(templateAngularJs, expectedPropsAngularJs);

    // Angular template
    let templateAngular = getFileContent(`${wcNameLowercase}.${HtmlTemplatesGenerator.AngularFileExtension}`);
    expect(templateAngular.includes(HtmlTemplatesGenerator.ifDirectiveAngular)).toBeFalsy();
    let expectedPropsAngular = ["[title]=\"properties.title\"", "[counter]=\"properties.counter\""];
    checkStringContains(templateAngular, expectedPropsAngular);
  }

  function checkStringContains(str: string, items: Array<string>) {
    for (let item of items) {
      expect(str.includes(item)).toBeTruthy();
    }
  }

  function getStringOccurrences(str: string, item: string) {
    let regexp = new RegExp(item, 'g');
    return (str.match(regexp) || []).length;
  }

  function getFileContent(fileName: string): string {
    let filePath = `${tempDir}/${fileName}`;
    expect(fs.existsSync(filePath)).toBeTruthy();
    return fs.readFileSync(filePath, 'utf8');
  }

  function getJsonFile(wcFile: string) {
    let jsonFile = wcFile.substring(0, wcFile.indexOf('.')) + ".json";
    // First letter lowercase
    return jsonFile.charAt(0).toLowerCase() + jsonFile.slice(1);
  }

  function getWcFileLowercase(wcFile: string) {
    wcFile = wcFile.substring(0, wcFile.indexOf("."));
    // First letter lowercase
    return wcFile.charAt(0).toLowerCase() + wcFile.slice(1);
  }

});
