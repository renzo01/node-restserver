const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIEN_ID);

const Usuario = require("../models/usuario");
const app = express();

app.post("/login", (req, res) => {
  let body = req.body;
  Usuario.findOne({ email: body.email }, (err, usuDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!usuDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "(Usuario) o contraseña incorrectos"
        }
      });
    }
    if (!bcrypt.compareSync(body.password, usuDB.password)) {
      return res.status(400).json({
        ok: false,
        message: "Usuario o (contraseña)incorrectos"
      });
    }

    let token = jwt.sign(
      {
        usuario: usuDB
      },
      process.env.SEED,
      { expiresIn: process.env.CADUCIDAD_TOKEN }
    );

    res.json({
      ok: true,
      usuario: usuDB,
      token
    });
  });
});

//cofiguracion de google
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIEN_ID // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload["sub"];

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  };
}

app.post("/google", async (req, res) => {
  let token = req.body.idtoken;
  let googleUser = await verify(token).catch(e => {
    return res.status(403).json({
      ok: false,
      err
    });
  });
  Usuario.findOne({ email: googleUser.email }, (err, usuDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (usuDB) {
      if (usuDB.google === false) {
        return res.status(400).json({
          ok: false,
          err:{
            message: "error usuario googgle es falso"
          }
        });
      } else {
        let token = jwt.sign(
          {
            usuario: usuDB
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );
        return res.json({
          ok: true,
          usuario: usuDB,
          token
        });
      }
    } else {
      // Si el usuario no existe en nuestra base de datos
      let usuario = new Usuario();
      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = googleUser.google;
      usuario.password = ":)";

      usuario.save((err, usuarioDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }
        let token = jwt.sign(
          {
            usuario: usuDB
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );
        return res.json({
          ok: true,
          usuario: usuDB,
          token
        });
      });
    }
  });
});

module.exports = app;
