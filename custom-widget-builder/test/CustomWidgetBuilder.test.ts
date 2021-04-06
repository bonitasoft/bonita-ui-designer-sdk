/*
 * Copyright © 2019 Bonitasoft S.A.
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
  test('should generate a correct json file when a simple web component is given as input', async () => {
    let builder = new CustomWidgetBuilder();
    let tempDir = fs.mkdtempSync(os.tmpdir());
    builder.generatePropertiesFile("test/resources/WcExample.ts", tempDir);
    let generatedFile = tempDir + "/WcExample.json";
    expect(fs.existsSync(generatedFile)).toBeTruthy();

    let jsonProperties = JSON.parse(fs.readFileSync(generatedFile, 'utf8'));
    expect(jsonProperties.id).toBe("wcExample");
    expect(jsonProperties.name).toBe("WcExample");
    expect(jsonProperties.template).toBe("@wcExample.tpl.html");
    expect(jsonProperties.description.length).toBeGreaterThan(0);
    expect(jsonProperties.order).toBe("1");
    expect(jsonProperties.icon.length).toBeGreaterThan(0);
    expect(jsonProperties.properties.length).toBe(2);
  });

});
