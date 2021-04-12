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

export class CustomTagHandler {

  public static readonly CUSTOM_TAG = "-@";
  public bond: string | undefined;
  public caption: string | undefined;
  public choiceValues: Array<String> | undefined;
  public constraints: PropertyConstraint | undefined;
  public label: string | undefined;
  public showFor: string | undefined;

  private desc: string;

  constructor(tagsDescription: string) {
    // e.g.
    // Position of the label
    // @type {choice}
    // -@choiceValues {"left"|"top"}
    // -@bond constant
    // -@showFor properties.labelHidden.value === false

    this.desc = tagsDescription;
    if (this.desc) {
      this.parse();
    }
  }

  private parse() {
    let index = this.getTagIndex(0);
    while (index != -1) {
      let tag = this.getTag(index);
      this.processTag(tag);
      index = this.getTagIndex(index + 1);
    }
  }

  private getTag(index: number): string {
    let tagIndex = this.getTagIndex(index);
    let tag = this.desc.substring(tagIndex);
    let nextLineIndex = tag.indexOf("\n");
    if (nextLineIndex != -1) {
      tag = tag.substring(0, nextLineIndex);
    }
    return tag;
  }

  private getTagIndex(index: number): number {
    return this.desc.indexOf(CustomTagHandler.CUSTOM_TAG, index);
  }

  private processTag(tag: string) {
    let firstSpaceIndex = tag.indexOf(" ");
    let tagName = tag.substring(2, firstSpaceIndex);
    let tagValue = tag.substring(firstSpaceIndex+1).trim();
    switch (tagName) {
      case 'bond':
        this.bond = tagValue;
        break;
      case 'caption':
        this.caption = tagValue;
        break;
      case 'choiceValues':
        this.setChoiceValues(tagValue);
        break;
      case 'constraints':
        this.setConstraints(tagValue);
        break;
      case 'label':
        this.label = tagValue;
        break;
      case 'showFor':
        this.showFor = tagValue;
        break;
     default:
        console.error(`Error: invalid tag: ${tagName}`);
    }
  }

  private setChoiceValues(choice: string) {
    // e.g. -@choiceValues {"left"|"top"}
    this.choiceValues = [];
    choice = this.removeFirstAndLastChar(choice);
    let values = choice.split("|")
    for (let value of values) {
      value = value.trim();
      value = this.removeQuotes(value);
      this.choiceValues.push(value);
    }
  }

  private setConstraints(constraint: string) {
    // e.g. -@constraints {"min": "1", "max": "12"}
    constraint = this.removeFirstAndLastChar(constraint);
    let values = constraint.split(",")
    let min, max;
    for (let value of values) {
      value = value.trim();
      value = this.removeQuotes(value);
      let items = value.split(":");
      if (items[0] === "min") {
        min = items[1].trim();
      } else if (items[0] === "max") {
        max = items[1].trim();
      }
    }
    this.constraints = new PropertyConstraint(min, max);
  }

  private removeFirstAndLastChar(str: string): string {
      return str.substring(1, str.length-1);
  }

  private removeQuotes(str: string) {
    // Remove leading and trailing double quotes
    return str.replace(/\"/g, "");
  }
}
