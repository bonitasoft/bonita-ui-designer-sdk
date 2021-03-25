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

