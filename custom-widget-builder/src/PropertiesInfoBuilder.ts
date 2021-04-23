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


export class PropertiesInfoBuilder {
  private readonly propertiesInfo: PropertiesInfo;

  constructor(name: string) {
    let id = PropertiesInfoBuilder.toCamelCase(name);
    this.propertiesInfo = {
      id: id,
      name: name,
      displayName: PropertiesInfoBuilder.getDisplayName(name),
      type: "widget",
      template: PropertiesInfoBuilder.getTemplate(id),
      description: undefined,
      order: "1",
      icon: PropertiesInfoBuilder.generateIcon(),
      properties: []
    }
  }

  displayName(displayName: string): PropertiesInfoBuilder {
    this.propertiesInfo.displayName = displayName;
    return this;
  }

  description(description: string): PropertiesInfoBuilder {
    this.propertiesInfo.description = description;
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

  build(): PropertiesInfo {
    return this.propertiesInfo;
  }

  private static toCamelCase(str: string): string {
    // e.g. pb-input -> pbInput
    return str.replace(/-([a-z])/g, (g) => {
      return g[1].toUpperCase()
    });
  }

  private static fromCamelCase(str: string): string {
    // e.g. allowHTML -> Allow html
    return str
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1 $2')
      .toLowerCase();
  }

  /**
   * Get the display name of a web component, or a property
   * e.g.:
   *  pb-input -> Input
   *  wc-example -> WcExample
   *  required -> Required
   *  labelWidth -> Label width
   *  allowHTML -> Allow html
   */
  public static getDisplayName(wcName: string): string {
    let name = wcName.replace(/^(pb-)/, "");
    // camel case to words
    name = PropertiesInfoBuilder.fromCamelCase(name);
    // dash notation to camel case
    name = PropertiesInfoBuilder.toCamelCase(name);
    // First letter uppercase
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  private static getTemplate(id: string): string {
    // e.g. pbInput -> @pbInput.tpl.html
    return `@${id}.tpl.html`;
  }

  private static generateIcon(): string {
    let randomString = Math.random().toString(36).substring(2, 15);
    return jdenticon.toSvg(randomString, 30);
  }

}
