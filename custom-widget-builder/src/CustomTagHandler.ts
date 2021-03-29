import {PropertyConstraint} from "./PropertyConstraint.js";

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
    let tag;
    let tagIndex = this.getTagIndex(index);
    tag = this.desc.substring(tagIndex);
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
    // e.g. -@bond constant
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
        console.log(`Error: invalid tag: ${tagName}`);
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
