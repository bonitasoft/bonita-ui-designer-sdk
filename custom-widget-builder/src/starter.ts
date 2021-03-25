import {CustomWidgetBuilder} from "./CustomWidgetBuilder.js";


let wcFile;
let outputDir;

for (let param of process.argv) {
  if (param.startsWith("wcFile")) {
    wcFile = getParameter(param);
  }
  if (param.startsWith("outputDir")) {
    outputDir = getParameter(param);
  }
}

console.log(`Generating widget for ${wcFile}...\n`);
new CustomWidgetBuilder().generatePropertiesFile(wcFile, outputDir);

function getParameter(param: string): any {
  return param.substr(param.indexOf('=') + 1);
}
