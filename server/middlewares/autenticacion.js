// jshint esversion: 6 
const jwt = require('jsonwebtoken');
// =====================
// Verificar Token
// =====================

//request, respuesta y next que indica que el programa continue
let verificaToken = (req, res, next) => {

    let token = req.get("Authorization");

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({ ok: false, err: { message: 'Token no Valido' } });
        }

        req.usuario = decoded.usuario;
        next();
    });


};

// =====================
// Verificar Rol de Admin
// =====================
let verificaAdmin_Role = (req, res, next) => {
    let token = req.get("Authorization");

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({ ok: false, err: { message: 'Token no Valido' } });
        }

        if (decoded.usuario.role != 'ADMIN_ROLE') {
            return res
                .status(401)
                .json({
                    ok: false,
                    err: { message: "Usuario no es Administrador" }
                });
        }
        next();
    });
};

module.exports = {
    verificaToken,
    verificaAdmin_Role
};