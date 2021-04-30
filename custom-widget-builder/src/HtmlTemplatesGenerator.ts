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

import {PropertiesInfo} from "./PropertiesInfo";
import {Property} from "./Property";
import fs from "fs";
import {Bond} from "./Bond";
import {CustomWidgetBuilder} from "./CustomWidgetBuilder";

enum FwkType {
  AngularJS,
  Angular
}

export class HtmlTemplatesGenerator {

  private readonly propertiesInfo: PropertiesInfo;
  private readonly outputDir: string;
  private static specificProperties: Array<string> = ["readOnly", "required"];
  private static toIgnoreProperties: Array<string> = ["id"];
  public static ifDirectiveAngularJS = "ng-if";
  public static ifDirectiveAngular = "*ngIf";
  public static AngularJsFileExtension = "tpl.html";
  public static AngularFileExtension = "tpl.runtime.html";

  constructor(propertiesInfo: PropertiesInfo, outputDir: string) {
    this.propertiesInfo = propertiesInfo;
    this.outputDir = outputDir;
  }

  public generate() {
    // General syntax:
    // <HtmlTag [IfBoolean] [SpecificProperties] [Properties]></HtmlTag>
    //
    // Example:
    // -- For UID editor (AngularJS) --                     -- Angular --
    // <pb-input ng-if="properties.labelHidden"             <pb-input *ngIf="properties.labelHidden"
    //           label-hidden                                         label-hidden
    //           ng-readonly="properties.readOnly"                    [readonly]="properties.readOnly"
    //           ng-required="properties.required"                    [required]="properties.required"
    //           label="{{properties.label}}"                         ...
    //           type="{{properties.type}}"                           ...
    //            ...                                                 ...
    //           value="{{properties.value}}">                        [(ngModel)]="properties.value"
    //           </pb-input>                                          </pb-input>
    // <pb-input ng-if="!properties.labelHidden"            ...
    //           ng-readonly="properties.readOnly"
    //           ng-required="properties.required"
    //           label="{{properties.label}}"
    //           type="{{properties.type}}"
    //            ...
    //           value="{{properties.value}}">
    //           </pb-input>

    this.writeFile(this.generateTemplate(FwkType.AngularJS), FwkType.AngularJS);
    this.writeFile(this.generateTemplate(FwkType.Angular), FwkType.Angular);
  }

  private generateTemplate(type: FwkType): string {
    let ifBoolean = this.generateIfBoolean(type);
    let specificProps = this.generateSpecificProperties(type);
    let props = this.generateProperties(type);
    let template = [];
    if (ifBoolean.length > 0) {
      for (let ifElem of ifBoolean) {
        template.push(this.generateHtmlTagStart());
        template.push(ifElem);
        template.push(specificProps);
        template.push(props);
        template.push(this.generateHtmlTagEnd());
      }
    } else {
      template.push(this.generateHtmlTagStart());
      template.push(specificProps);
      template.push(props);
      template.push(this.generateHtmlTagEnd());
    }
    return template.join('');
  }

  private generateHtmlTagStart(): string {
    return `<${this.getHtmlTag()} `;
  }

  private generateHtmlTagEnd(): string {
    return `></${this.getHtmlTag()}>\n`;
  }

  /**
   * Generate an array of the different combinations, for boolean properties
   */
  private generateIfBoolean(type: FwkType): Array<string> {
    // e.g:
    // [0] ng-if="properties.labelHidden && properties.allowHTML"
    //       label-hidden
    //       allow-html
    // [1] ng-if="properties.labelHidden && !properties.allowHTML"
    //       label-hidden
    // [2] ng-if="!properties.labelHidden && properties.allowHTML"
    //       allow-html
    // [3] ng-if="!properties.labelHidden && !properties.allowHTML"
    let ifCommand;
    if (type === FwkType.AngularJS) {
      ifCommand = HtmlTemplatesGenerator.ifDirectiveAngularJS;
    } else if (type === FwkType.Angular) {
      ifCommand = HtmlTemplatesGenerator.ifDirectiveAngular;
    }
    let booleanProps = [];
    for (let prop of this.propertiesInfo.properties) {
      if (HtmlTemplatesGenerator.isSpecific(prop) || !HtmlTemplatesGenerator.isBoolean(prop)) {
        continue;
      }
      booleanProps.push(prop);
    }
    // Get all the possible true/false combinations
    let combinations = HtmlTemplatesGenerator.booleanComb(booleanProps.length);
    let ifArray: Array<string> = [];
    for (let combIndex = 0; combIndex < combinations.length; combIndex++) {
      let ifElem: Array<String> = [];
      // One combination of booleans, e.g. '[true, true]'
      let combination = combinations[combIndex];
      ifElem.push(`${ifCommand}="`);
      for (let valIndex = 0; valIndex < combination.length; valIndex++) {
        // One boolean, e.g. 'true'
        let booleanVal = combination[valIndex];
        if (valIndex !== 0) {
          ifElem.push(' && ');
        }
        ifElem.push(`${booleanVal ? '' : '!'}properties.${booleanProps[valIndex].name}`);
      }
      ifElem.push('"\n\t');
      // Iteration to get the required boolean properties
      for (let valIndex = 0; valIndex < combinations[combIndex].length; valIndex++) {
        let combination = combinations[combIndex];
        let booleanVal = combination[valIndex];
        if (booleanVal) {
          ifElem.push(`${booleanProps[valIndex].name}\n\t`);
        }
      }
      ifArray.push(ifElem.join(''))
    }
    return ifArray;
  }

  private generateSpecificProperties(type: FwkType): string {
    let specificProps = "";
    for (let prop of this.propertiesInfo.properties) {
      if (!HtmlTemplatesGenerator.isSpecific(prop)) {
        continue;
      }
      if (type === FwkType.AngularJS) {
        specificProps += `ng-${prop.name.toLowerCase()}="properties.${prop.name}"\n\t`
      } else if (type === FwkType.Angular) {
        specificProps += `[${prop.name.toLowerCase()}]="properties.${prop.name}"\n\t`
      }
    }
    return specificProps;
  }

  private generateProperties(type: FwkType): string {
    let props = "";
    for (let prop of this.propertiesInfo.properties) {
      if (HtmlTemplatesGenerator.isToIgnore(prop) ||
        HtmlTemplatesGenerator.isSpecific(prop) ||
        HtmlTemplatesGenerator.isBoolean(prop)) {
        continue;
      }
      if (type === FwkType.Angular && prop.bond === Bond.Variable) {
        props += `[(ngModel)]="properties.${prop.name}"\n\t`;
      } else {
        props += `${prop.name}="{{properties.${prop.name}}}"\n\t`;
      }
    }
    return props;
  }

  private static isSpecific(prop: Property): boolean {
    return HtmlTemplatesGenerator.specificProperties.includes(prop.name);
  }

  private static isToIgnore(prop: Property): boolean {
    return HtmlTemplatesGenerator.toIgnoreProperties.includes(prop.name);
  }

  private static isBoolean(prop: Property) {
    return prop.type === "boolean";
  }

  private static booleanComb(nb: number): Array<Array<boolean>> {
    let globalArray: Array<Array<boolean>> = [];
    if (nb === 0) {
      return globalArray;
    }
    for (let ii = 0; ii < (1 << nb); ii++) {
      let boolArr = [];
      for (let jj = 0; jj < nb; jj++) {
        boolArr.push(Boolean(ii & (1 << jj)));
      }
      globalArray.push(boolArr);
    }
    return globalArray;
  }

  private writeFile(template: string, type: FwkType) {
    let ext;
    if (type === FwkType.AngularJS) {
      ext = HtmlTemplatesGenerator.AngularJsFileExtension;
    } else if (type === FwkType.Angular) {
      ext = HtmlTemplatesGenerator.AngularFileExtension;
    }
    let filePath = `${this.outputDir}/${this.propertiesInfo.id}.${ext}`;
    fs.writeFileSync(filePath, template);
    console.log(`${filePath} has been generated!`);

  }

  private getHtmlTag() {
    return CustomWidgetBuilder.fromCamelCase(this.propertiesInfo.id, '-').toLowerCase();
  }

}

