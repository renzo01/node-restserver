//process siempre esta corriendo en el background
//Puerto
process.env.PORT = process.env.PORT || 3000;

//entornos
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//vencimiento del token
process.env.CADUCIDAD_TOKEN = '48h'

//seed de encriptacion
process.env.SEED = process.env.SEED||"este-es-el-seed-desarrollo";

//Base de datos
let urlDB;

if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/cafe";
} else {
  urlDB =
    process.env.MONGO_URI;
}


process.env.URLDB = urlDB;

//gooogle client ID

process.env.CLIEN_ID = process.env.CLIEN_ID || '199930481230-gbqpes33d0p44q4eustvrjpqlcm5dm7q.apps.googleusercontent.com';