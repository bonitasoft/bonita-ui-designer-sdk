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
import {PropertyConstraint} from "./PropertyConstraint";
import {Bond} from "./Bond";
import {PropertyType} from "./PropertyType";
import {PropertiesInfoBuilder} from "./PropertiesInfoBuilder";


export class PropertyBuilder {
  private readonly _property: Property;

  constructor(name: string, type: PropertyType) {
    this._property = {
      name: name,
      type: type,
      label: PropertiesInfoBuilder.getDisplayName(name),
      help: undefined,
      defaultValue: undefined,
      constraints: undefined,
      showFor: undefined,
      bond: undefined,
      choiceValues: undefined,
      caption: undefined
    }
  }

  label(label: string): PropertyBuilder {
    this._property.label = label;
    return this;
  }

  help(help: string): PropertyBuilder {
    this._property.help = help;
    return this;
  }

  defaultValue(defaultValue: string | number | boolean): PropertyBuilder {
    this._property.defaultValue = defaultValue;
    return this;
  }

  constraints(constraints: PropertyConstraint): PropertyBuilder {
    this._property.constraints = constraints;
    return this;
  }

  showFor(showFor: string): PropertyBuilder {
    this._property.showFor = showFor;
    return this;
  }

  bond(bond: Bond): PropertyBuilder {
    this._property.bond = bond;
    return this;
  }

  choiceValues(choiceValues: Array<string>): PropertyBuilder {
    this._property.choiceValues = choiceValues;
    return this;
  }

  caption(caption: string): PropertyBuilder {
    this._property.caption = caption;
    return this;
  }

  build(): Property {
    return this._property;
  }
}
