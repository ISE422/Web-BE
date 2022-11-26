const exphbs = require("express-handlebars");
module.exports = (app) => {
  app.engine(
    "hbs",
    exphbs.engine({
      layoutsDir: "views/_layouts/",
      defaultLayout: "main.hbs",
      extname: ".hbs",
    })
  );
  app.set("view engine", "hbs");
};
