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

import {PropertyConstraint} from "./PropertyConstraint";
import {Bond} from "./Bond";
import {PropertyType} from "./PropertyType";

export interface Property {
  name: string;
  type: PropertyType | undefined;
  label: string | undefined;
  help?: string | undefined;
  defaultValue: string | number | boolean | undefined;
  constraints?: PropertyConstraint | undefined;
  showFor?: string | undefined;
  bond: Bond | undefined;
  choiceValues?: Array<string> | undefined;
  caption?: string | undefined;
}

