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

export interface PropertiesInfo {
  id: string;
  name: string;
  type: string;
  template: string;
  description: string | undefined;
  order: string;
  custom: boolean;
  modelVersion: string;
  jsBundle: string | undefined;
  htmlBundle: string | undefined;
  icon: string;
  properties: Array<Property>;
}

