// Run OPP develop mode
const gulp = require("gulp");

require("./clean.js");
require("./gen-icons.js");
require("./prpl.js");
require("./translations.js");


gulp.task(
  "develop-app",
  gulp.series(
    async function setEnv() {
      process.env.NODE_ENV = "development";
    },
    "clean",
    gulp.parallel(
      "gen-icons",
      "serve",
      gulp.series("create-test-translation", "build-translations")
    )
  )
);

gulp.task(
  "build-app",
  gulp.series(
    async function setEnv() {
      process.env.NODE_ENV = "production";
    },
    "clean",
    gulp.parallel("gen-icons", "build-translations"),
  )
);
