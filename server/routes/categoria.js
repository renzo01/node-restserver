const express = require("express");

let {
  verificaToken,
  verificaAdmin_Role
} = require("../middlewares/autentificacion");

let app = express();

let Categoria = require("../models/categoria");

//muestra todas las categorias
app.get("/categoria", verificaToken, (req, res) => {
    Categoria.find({})
    .sort('descripcion')
    .populate('usuario','nombre email')
    .exec((err, listadoCategoria) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }
        res.json({
            ok: true,
            categoria: listadoCategoria
        })
      });
});
//muestra la categoria por id
app.get("/categoria/:id", verificaToken, (req, res) => {
  //Categoria.findById();

  let id = req.params.id

  Categoria.findById(id,(err, listadoCategoria) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!listadoCategoria) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
    res.json({
        ok: true,
        categoria: listadoCategoria
    })
  });
});
//crea una nueva categoria
app.post("/categoria", verificaToken, (req, res) => {
  //regresa la nueva categoria
  let body = req.body;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario_id
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});
//Actualiza la categoria
app.put("/categoria/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let descCategoria = { descripcion: body.descripcion };

  Categoria.findByIdAndUpdate(
    id,
    descCategoria,
    { new: true, runValidators: true },
    (err, categoriaUPD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!categoriaUPD) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      res.json({
        ok: true,
        categoria: categoriaUPD
      });
    }
  );
});
//Elimina la categoria segun el id
app.delete(
  "/categoria/:id",
  [verificaToken, verificaAdmin_Role],
  (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!categoriaBorrada) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El id no existe"
          }
        });
      }
      res.json({
        ok: true,
        message: "Categoria borrada"
      });
    });
  }
);
module.exports = app;
