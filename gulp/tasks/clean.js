const del = require("del");
const gulp = require("gulp");
const config = require("../paths");

gulp.task("clean", () => del([config.build_dir]));
gulp.task("clean-demo", () => del([config.build_dir]));
