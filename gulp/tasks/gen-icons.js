const gulp = require('gulp');
const through = require('through2');
const path = require("path");
const rename = require('gulp-rename');
const fs = require("fs");

const ICON_PACKAGE_PATH = path.resolve(
  __dirname,
  "../../node_modules/@mdi/svg/"
);
const META_PATH = path.resolve(ICON_PACKAGE_PATH, "meta.json");
const ICON_PATH = path.resolve(ICON_PACKAGE_PATH, "svg");
const OUTPUT_DIR = path.resolve(__dirname, "../../build");

// Given an SVG file, convert it to an iron-iconset-svg definition
function transformXMLtoPolymer(name, xml) {
  const start = xml.indexOf("><path") + 1;
  const end = xml.length - start - 6;
  const path = xml.substr(start, end);
  return `<g id="${name}">${path}</g>`;
}

// Given an iconset name and icon names, generate a polymer iconset
function generateIconset(iconSetName, iconNames) {
  const iconDefs = iconNames
    .map((name) => {
      const iconDef = loadIcon(name);
      if (!iconDef) {
        throw new Error(`Unknown icon referenced: ${name}`);
      }
      return transformXMLtoPolymer(name, iconDef);
    })
    .join("");
  return `
    import '@polymer/iron-iconset-svg';
    import {html} from '@polymer/polymer/lib/utils/html-tag.js';

    const template = html\`<opp-iconset-svg name="${iconSetName}" size="24">
      <svg>
        <defs>
          ${iconDefs}
        </defs>
      </svg>
    </opp-iconset-svg>\`;

    document.head.appendChild(template.content);`;
}

// Helper function to map recursively over files in a folder and it's subfolders
function mapFiles(startPath, filter, mapFunc) {
  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      mapFiles(filename, filter, mapFunc);
    } else if (filename.indexOf(filter) >= 0) {
      mapFunc(filename);
    }
  }
}

// Given an icon name, load the SVG file
function loadIcon(name) {
    const iconPath = path.resolve(ICON_PATH, `${name}.svg`);
    try {
      return fs.readFileSync(iconPath , "utf-8");
    } catch (err) {
      return null;
    }
}

// Find all MDI icons.
function findMDIIcons() {
  const meta = JSON.parse(
    fs.readFileSync(path.resolve(ICON_PACKAGE_PATH, META_PATH), "UTF-8")
  );
  return meta.map((iconInfo) => iconInfo.name);
}

// Find all icons used by the project.
function findOppIcons() {
  debugger;
  const path = "./src";
  const iconsetName = "opp";
  const iconRegex = new RegExp(`${iconsetName}:[\\w-]+`, "g");
  const icons = new Set();
  function processFile(filename) {
    const content = fs.readFileSync(filename);
    let match;
    // eslint-disable-next-line
    while ((match = iconRegex.exec(content))) {
      // strip off "opp:" and add to set
      icons.add(match[0].substr(iconsetName.length + 1));
    }
  }
  mapFiles(path, ".js", processFile);
  mapFiles(path, ".ts", processFile);
  return Array.from(icons);
}

function genIconJS(findFunction, IconSetName, bsname) {
  const iconNames = findFunction();
  // empty stream
  return gulp.src('.', { allowEmpty: true })
  .pipe(through.obj(function(file, _, cb) {
    file.contents = Buffer.from(
        generateIconset(IconSetName, iconNames));
    cb(null, file)
  }))
  .pipe(rename({ 
    basename: bsname, 
    extname: ".js" }))
  .pipe(gulp.dest(OUTPUT_DIR));
}

gulp.task("gen-icons-mdi", () => genIconJS(findMDIIcons, "mdi", "mdi"));
gulp.task("gen-icons-opp", () => genIconJS(findOppIcons, "opp", "opp-icons"));
gulp.task("gen-icons", gulp.parallel("gen-icons-mdi", "gen-icons-opp"), () => {});

module.exports = {
  findMDIIcons,
  findOppIcons,
  generateIconset,
  genIconJS,
};