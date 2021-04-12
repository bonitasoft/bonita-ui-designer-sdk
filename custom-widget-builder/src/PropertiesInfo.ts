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

export class PropertiesInfo {
  public id: string;
  public name: string;
  public type: string;
  public template: string;
  public description: string;
  public order: string;
  public icon: string;
  public properties: Array<Property>;


  constructor(
    id: string, name: string, type: string, template: string, description: string, order: string, icon: string,
    properties: Array<Property>
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.template = template;
    this.description = description;
    this.order = order;
    this.icon = icon;
    this.properties = properties;
  }
}

