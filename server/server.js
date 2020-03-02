require("./config/config");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require("./routes/usuario"));

async function establecerConexion() {
  await mongoose.connect(
    process.env.URLDB,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    },
    (err, resp) => {
      if (err) throw err;

      console.log("Base de datos online");
    }
  );
}

establecerConexion();

app.listen(process.env.PORT, () =>
  console.log(`Escuchando el puerto ${process.env.PORT}`)
);
