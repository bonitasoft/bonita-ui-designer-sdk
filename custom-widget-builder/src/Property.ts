import {PropertyConstraint} from "./PropertyConstraint";
import {PropertyChoice} from "./PropertyChoice";

export class Property {
  public label: string;
  public name: string;
  public help: string | undefined;
  public type: string;
  public defaultValue: string;
  public constraints: PropertyConstraint | undefined;
  public showFor: string | undefined;
  public bond: string | undefined;
  public choiceValues: PropertyChoice | undefined;


  constructor(label: string, name: string, type: string, defaultValue: string, help?: string, bond?: string, constraints?: PropertyConstraint,
              showFor?: string, choiceValues?: PropertyChoice) {
    this.label = label;
    this.name = name;
    this.help = help;
    this.type = type;
    this.defaultValue = defaultValue;
    this.constraints = constraints;
    this.showFor = showFor;
    this.bond = bond;
    this.choiceValues = choiceValues;
  }


}

