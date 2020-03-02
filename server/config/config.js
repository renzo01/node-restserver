//process siempre esta corriendo en el background
//Puerto
process.env.PORT = process.env.PORT || 3000;

//entornos
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//Base de datos
let urlDB;

//if (process.env.NODE_ENV === "dev") {
//  urlDB = "mongodb://localhost:27017/cafe";
//} else {
  urlDB =
    "mongodb+srv://OverLord:SO76ooBidcB2wzG3@cluster0-efmkc.mongodb.net/Cafe";
//}

process.env.URLDB = urlDB;