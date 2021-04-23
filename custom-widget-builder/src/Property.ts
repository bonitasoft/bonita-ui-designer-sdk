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

export class Property {
  public label: string;
  public name: string;
  public help: string | undefined;
  public type: string;
  public defaultValue: string | number | boolean;
  public constraints: PropertyConstraint | undefined;
  public showFor: string | undefined;
  public bond: Bond | undefined;
  public choiceValues: Array<String> | undefined;
  public caption: string | undefined;


  constructor(label: string, name: string, type: string, defaultValue: string | number | boolean, help?: string, bond?: Bond, constraints?: PropertyConstraint,
              showFor?: string, choiceValues?: Array<String>, caption?: string) {
    this.label = label;
    this.name = name;
    this.help = help;
    this.type = type;
    this.defaultValue = defaultValue;
    this.constraints = constraints;
    this.showFor = showFor;
    this.bond = bond;
    this.choiceValues = choiceValues;
    this.caption = caption;
  }
}

