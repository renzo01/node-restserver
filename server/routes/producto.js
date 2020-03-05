const express = require("express");

const app = express();

let { verificaToken } = require("../middlewares/autentificacion");

let Producto = require("../models/producto");

//Obtiene todos los productos
app.get("/productos", [verificaToken], (req, res) => {
  let desde = req.query.desde;
  desde = Number(desde);

  Producto.find({ disponible: true })
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .populate("categoria", "nombre descripcion")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message:
              "No se pudieron mostrar los productos, contacte con nosotros."
          }
        });
      }
      res.json({
        ok: true,
        productoDB
      });
    });
});
app.get("/productos/:id",[verificaToken], (req, res) => {
  let id = req.params.id;

  Producto.findById(id)
    .populate("usuario", "nombre email")
    .populate("categoria", "nombre")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "No se pudo mostrar el producto prueve con otro id"
          }
        });
      }
      res.json({
        ok:true,
        producto: productoDB
      })
    });
});
//Obtener los productos por criterio de busqueda.
app.get('/productos/buscar/:termino',[verificaToken], (req, res) =>{
  let termino = req.params.termino;
  let regex = new RegExp(termino,'i');

  Producto.find({nombre: regex}).populate("categoria", "nombre").exec((err, productoDB)=>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if(!productoDB){
      return res.status(500).json({
        ok: false,
        err:{
          message: 'No existe el producto que esta buscando.'
        }
      })
    }
    res.json({
      ok:true,
      producto: productoDB
    })
  })
})
//crea un producto
app.post("/productos", [verificaToken], (req, res) => {
  //se obtiene los datos para la creacion
  let body = req.body;
  //colocar el los datos en las variables
  let producto = new Producto({
    usuario: req.usuario._id,
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria
  });
  producto.save((err, productoCreado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!productoCreado) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    res.status(201).json({
      ok: true,
      producto: productoCreado
    });
  });
});
app.put("/productos/:id", [verificaToken], (req, res) => {
  let id = req.params.id;
  let body = req.body;
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El producto no existe"
        }
      });
    }
    (productoDB.nombre = body.nombre),
      (productoDB.precioUni = body.precioUni),
      (productoDB.categoria = body.categoria),
      (productoDB.disponible = body.disponible),
      (productoDB.descripcion = body.descripcion);

    productoDB.save((err, productoGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!productoGuardado) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El producto no se pudo guardar"
          }
        });
      }
      res.json({
        ok: true,
        producto: productoGuardado
      });
    });
  });
});

app.delete("/productos/:id", [verificaToken], (req, res) => {
    let id = req.params.id;
  let setFalseAvialiable = {
    disponible: false
  };

  Producto.findByIdAndUpdate(
    id,
    setFalseAvialiable,
    (err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!productoDB) {
        return res.status(500).json({
          ok: false,
          err: {
            message: "El producto no pudo ser eliminado"
          }
        });
      }
      res.json({
        ok: true,
        productoDB
      });
    }
  ); 
});
module.exports = app;
