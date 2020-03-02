const jwt = require("jsonwebtoken");

//==========================
// Verificar Tokens
//=========================
let verificaToken = (req, res, next) => {
  let token = req.get("token");
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token no valido"
        }
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
};
//==========================
// Verificar Admin-role
//=========================

let verificaAdmin_Role = (req, res, next) => {
  let usuario = req.usuario;
    if(usuario.role === "ADMIN_ROLE"){
        next();
    }else{
        return res.status(400).json({
            ok: false,
            err:{
                message: "Este usuario no puede hacer estos cambios"
            }
        })
    }
};
module.exports = {
  verificaToken,
  verificaAdmin_Role
};
