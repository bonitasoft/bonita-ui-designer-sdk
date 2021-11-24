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

import {Property} from "./Property";
import {PropertiesInfo} from "./PropertiesInfo";
import * as jdenticon from "jdenticon/standalone";
import {Asset} from "./Asset";
import camelCase from 'lodash.camelcase';
import upperFirst from "lodash.upperfirst";
import startCase from "lodash.startcase";


export class PropertiesInfoBuilder {
  private readonly propertiesInfo: PropertiesInfo;

  constructor(name: string) {
    let id = camelCase(name);
    this.propertiesInfo = {
      id: id,
      name: PropertiesInfoBuilder.componentDisplayName(name),
      type: "widget",
      template: PropertiesInfoBuilder.getTemplate(id),
      description: undefined,
      order: "1",
      custom: true,
      modelVersion: "3.0",
      jsBundle: undefined,
      htmlBundle: undefined,
      icon: PropertiesInfoBuilder.generateIcon(),
      properties: [],
      assets: []
    }
  }

  description(description: string): PropertiesInfoBuilder {
    this.propertiesInfo.description = description;
    return this;
  }

  custom(custom: boolean): PropertiesInfoBuilder {
    this.propertiesInfo.custom = custom;
    return this;
  }

  icon(icon: string): PropertiesInfoBuilder {
    this.propertiesInfo.icon = icon;
    return this;
  }

  properties(properties: Array<Property>): PropertiesInfoBuilder {
    this.propertiesInfo.properties = properties;
    return this;
  }

  assets(assets: Array<Asset>): PropertiesInfoBuilder {
    this.propertiesInfo.assets = assets;
    return this;
  }

  build(): PropertiesInfo {
    return this.propertiesInfo;
  }

  /**
   * Get the display name of a property
   * e.g.:
   *  uid-input -> Input
   *  wc-example -> WcExample
   *  required -> Required
   *  labelWidth -> Label width
   *  allowHTML -> Allow html
   */
  public static propertyDisplayName(value: string): string {
    let name = value.replace(/^(uid-)/, "");
    return upperFirst(startCase(name).toLowerCase());
  }

  public static componentDisplayName(value: string): string {
    let name = value.replace(/^(uid-)/, "");
    return upperFirst(camelCase(name));
  }

  private static getTemplate(id: string): string {
    // e.g. uidInput -> @uidInput.tpl.html
    return `@${id}.tpl.html`;
  }

  private static generateIcon(): string {
    let randomString = Math.random().toString(36).substring(2, 15);
    return jdenticon.toSvg(randomString, 30);
  }

}
