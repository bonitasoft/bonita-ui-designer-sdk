import {PropertyConstraint} from "./PropertyConstraint";

export class Property {
  public label: string;
  public name: string;
  public help: string | undefined;
  public type: string;
  public defaultValue: string | number | boolean;
  public constraints: PropertyConstraint | undefined;
  public showFor: string | undefined;
  public bond: string | undefined;
  public choiceValues: Array<String> | undefined;
  public caption: string | undefined;


  constructor(label: string, name: string, type: string, defaultValue: string | number | boolean, help?: string, bond?: string, constraints?: PropertyConstraint,
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

