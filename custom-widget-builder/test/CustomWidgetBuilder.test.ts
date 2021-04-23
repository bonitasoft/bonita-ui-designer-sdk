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

const fs = require('fs');

describe('CustomWidgetBuilder', () => {

  let builder: CustomWidgetBuilder;
  let tempDir: string;

  beforeAll(() => {
    builder = new CustomWidgetBuilder();
    tempDir = fs.mkdtempSync(os.tmpdir());
  });

  afterAll(() => {
    fs.rmdirSync(tempDir, {recursive: true});
  });

  test('should generate correct json file when a simple web component is given as input', async () => {
    handleSimpleWC("WcExample.ts");
  });

  test('should generate a correct json file when a complex web component is given as input', async () => {
    builder.generate("test/resources/pb-input.ts", tempDir);

    let jsonProperties = JSON.parse(getFileContent("pbInput.json"));
    // General info
    expect(jsonProperties.id).toBe("pbInput");
    expect(jsonProperties.displayName).toBe("Input");
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
    builder.generate("test/resources/app-drawer.js", tempDir);
    let jsonProperties = JSON.parse(getFileContent("appDrawer.json"));
    // General info
    expect(jsonProperties.id).toBe("appDrawer");
    expect(jsonProperties.displayName).toBe("AppDrawer");
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

  function handleSimpleWC(wcFilename: string) {
    let wcNameUppercase = wcFilename.substring(0, wcFilename.indexOf("."));
    let wcNameLowercase = wcNameUppercase.charAt(0).toLowerCase() + wcNameUppercase.slice(1);
    builder.generate(`test/resources/${wcFilename}`, tempDir);

    let jsonProperties = JSON.parse(getFileContent(`${wcNameUppercase}.json`));
    // General info
    expect(jsonProperties.id).toBe(wcNameLowercase);
    expect(jsonProperties.displayName).toBe(wcNameUppercase);
    expect(jsonProperties.template).toBe(`@${wcNameLowercase}.tpl.html`);
    expect(jsonProperties.description.length).toBeGreaterThan(0);
    expect(jsonProperties.order).toBe("1");
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

});