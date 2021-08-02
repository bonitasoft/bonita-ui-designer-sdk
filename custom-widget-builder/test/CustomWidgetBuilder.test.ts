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
import * as os from "os";
import extract from "extract-zip";
import { sep } from 'path';

const fs = require('fs');

describe('CustomWidgetBuilder', () => {

  let builder: CustomWidgetBuilder;
  let tempDir: string;

  beforeAll(() => {
    builder = new CustomWidgetBuilder();
    tempDir = fs.mkdtempSync(`${os.tmpdir()}${sep}`);
  });

  afterAll(() => {
    fs.rmdirSync(tempDir, {recursive: true});
  });

  test('should generate correct json file when a simple web component is given as input', async () => {
    handleSimpleWC("WcExample.ts");
  });

  test('should generate a correct json file when a complex web component is given as input', async () => {
    builder.generatePropertyFileFromWcFile("test/resources/uid-input.ts", tempDir);

    let jsonProperties = JSON.parse(getFileContent("uidInput.json"));
    // General info
    expect(jsonProperties.id).toBe("uidInput");
    expect(jsonProperties.name).toBe("Input");
    expect(jsonProperties.properties.length).toBe(15);

    // Properties
    let props = jsonProperties.properties;

    let required = props.filter((prop: any) => {
      return prop.name === "required"
    })[0];
    expect(required.type).toBe("boolean");
    expect(required.defaultValue).toBeFalsy();

    let minLength = props.filter((prop: any) => {
      return prop.name === "minLength"
    })[0];
    expect(minLength.label).toBe("Min length");

    let label = props.filter((prop: any) => {
      return prop.name === "label"
    })[0];
    expect(label.type).toBe("text");

    let value = props.filter((prop: any) => {
      return prop.name === "value"
    })[0];
    expect(value.type).toBe("text");
    expect(value.defaultValue.length).toBe(0);
  });

  test('should generate a correct json file when a JavaScript web component is given as input', async () => {
    handleSimpleWC("WcExample2.js");
  });

  test('should generate a correct json file when a standard web component is given as input', async () => {
    // Standard web component (i.e. extending HTMLElement)
    builder.generatePropertyFileFromWcFile("test/resources/app-drawer.js", tempDir);
    let jsonProperties = JSON.parse(getFileContent("appDrawer.json"));
    // General info
    expect(jsonProperties.id).toBe("appDrawer");
    expect(jsonProperties.name).toBe("AppDrawer");
    expect(jsonProperties.properties.length).toBe(2);

    // Properties
    let props = jsonProperties.properties;

    let open = props.filter((prop: any) => {
      return prop.name === "open"
    })[0];
    expect(open.label).toBe("Open");
    let disabled = props.filter((prop: any) => {
      return prop.name === "disabled"
    })[0];
    expect(disabled.label).toBe("Disabled");
  });

  test('should generate a correct json file when a web component name is given as input', async () => {
    builder.generatePropertyFileFromWcName("my-web-component", tempDir);
    let jsonProperties = JSON.parse(getFileContent("myWebComponent.json"));
    // General info
    expect(jsonProperties.id).toBe("myWebComponent");
    expect(jsonProperties.name).toBe("MyWebComponent");
    expect(jsonProperties.properties.length).toBe(2);
  });

  test('should generate a widget zip file when a web component json properties file and bundle are given as input', async () => {
    builder.generatePropertyFileFromWcFile("test/resources/my-input/src/my-input.ts", tempDir);
    await builder.generateWidget(`${tempDir}/myInput.json`, "test/resources/my-input/lib/my-input.es5.min.js", tempDir, true);
    let zipFile = `${tempDir}/widget-MyInput.zip`;
    checkExistNotEmpty(zipFile);

    // Check zip content
    let extractDir = `${tempDir}/widget-myInput`;
    fs.mkdirSync(extractDir);
    await extract(zipFile, {dir: extractDir})
    checkExistNotEmpty(`${extractDir}/widget.properties`);
    checkExistNotEmpty(`${extractDir}/resources/myInput.tpl.html`);
    checkExistNotEmpty(`${extractDir}/resources/widget.json`);
    checkExistNotEmpty(`${extractDir}/resources/assets/js/my-input.es5.min.js`);
    checkExistNotEmpty(`${extractDir}/resources/assets/js/myInput.tpl.runtime.html`);

    let propertiesFile = JSON.parse(fs.readFileSync(`${extractDir}/resources/widget.json`));
    //Check properties file updated with assets
    expect(propertiesFile.assets.length).toBe(2);
    let bundleAsset = propertiesFile.assets[0];
    expect(bundleAsset.id).not.toBeUndefined();
    expect(bundleAsset.name).toBe("my-input.es5.min.js");
    expect(bundleAsset.type).toBe("js");
    let templateAsset = propertiesFile.assets[1];
    expect(templateAsset.id).not.toBeUndefined();
    expect(templateAsset.name).toBe("myInput.tpl.runtime.html");
    expect(templateAsset.type).toBe("js");
    //Check properties file updated with bundles
    expect(propertiesFile.custom).toBeTruthy();
    expect(propertiesFile.jsBundle).toBe("assets/js/my-input.es5.min.js");
    expect(propertiesFile.htmlBundle).toBe("assets/js/myInput.tpl.runtime.html");
  });

  test('should generate a standard widget zip file when the custom parameter is false', async () => {
    builder.generatePropertyFileFromWcFile("test/resources/uid-input/src/uid-input.ts", tempDir);
    await builder.generateWidget(`${tempDir}/uidInput.json`, "test/resources/uid-input/lib/uid-input.es5.min.js", tempDir, false);
    let zipFile = `${tempDir}/widget-Input.zip`;
    checkExistNotEmpty(zipFile);

    // Check zip content
    let extractDir = `${tempDir}/widget-uidInput`;
    fs.mkdirSync(extractDir);
    await extract(zipFile, {dir: extractDir})
    checkExistNotEmpty(`${extractDir}/widget.properties`);
    checkExistNotEmpty(`${extractDir}/resources/uidInput.tpl.html`);
    checkExistNotEmpty(`${extractDir}/resources/widget.json`);
    checkExistNotEmpty(`${extractDir}/resources/assets/js/uid-input.es5.min.js`);
    checkExistNotEmpty(`${extractDir}/resources/assets/js/uidInput.tpl.runtime.html`);

    //Check properties file updated with bundles
    let propertiesFile = JSON.parse(fs.readFileSync(`${extractDir}/resources/widget.json`));
    expect(propertiesFile.custom).toBeFalsy();
    expect(propertiesFile.jsBundle).toBe("assets/js/uid-input.es5.min.js");
    expect(propertiesFile.htmlBundle).toBe("assets/js/uidInput.tpl.runtime.html");
  });

  function handleSimpleWC(wcFilename: string) {
    let wcNameUppercase = wcFilename.substring(0, wcFilename.indexOf("."));
    let wcNameLowercase = wcNameUppercase.charAt(0).toLowerCase() + wcNameUppercase.slice(1);
    builder.generatePropertyFileFromWcFile(`test/resources/${wcFilename}`, tempDir);

    let jsonProperties = JSON.parse(getFileContent(`${wcNameLowercase}.json`));
    // General info
    expect(jsonProperties.id).toBe(wcNameLowercase);
    expect(jsonProperties.name).toBe(wcNameUppercase);
    expect(jsonProperties.template).toBe(`@${wcNameLowercase}.tpl.html`);
    expect(jsonProperties.description.length).toBeGreaterThan(0);
    expect(jsonProperties.order).toBe("1");
    expect(jsonProperties.custom).toBe(true);
    expect(jsonProperties.modelVersion).toBe("3.0");
    expect(jsonProperties.icon.length).toBeGreaterThan(0);
    expect(jsonProperties.properties.length).toBe(2);
    // Properties
    let title = jsonProperties.properties[0];
    expect(title.label).toBe("Title");
    expect(title.name).toBe("title");
    expect(title.type).toBe("text");
    expect(title.defaultValue.length).toBeGreaterThan(0);
    let counter = jsonProperties.properties[1];
    expect(counter.label).toBe("Counter");
    expect(counter.name).toBe("counter");
    expect(counter.type).toBe("integer");
    expect(counter.defaultValue).not.toBeNaN();
  }

  function getFileContent(fileName: string): string {
    let filePath = `${tempDir}/${fileName}`;
    expect(fs.existsSync(filePath)).toBeTruthy();
    return fs.readFileSync(filePath, 'utf8');
  }

  function checkExistNotEmpty(file: string) {
    expect(fs.existsSync(file)).toBeTruthy();
    expect(fs.statSync(file).size).toBeGreaterThan(0);
  }

});
