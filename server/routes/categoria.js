/*jshint esversion: 6 */

const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const _ = require("underscore");
const Categoria = require('../models/categoria');
const app = express();


// ============================
// Mostrar todas las Categorias
// ============================
app.get('/categoria', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Categoria.find({})
        .skip(desde)
        .limit(limite)
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res
                    .status(400)
                    .json({
                        ok: false,
                        err
                    });
            }

            Categoria.count((err, cont) => {
                res.json({
                    ok: true,
                    categorias,
                    conteo: cont
                });
            });
        });

});

// ============================
// Mostrar una categoria por ID
// ============================
app.get("/categoria/:id", verificaToken, (req, res) => {
    // Categoria.findById()
    let id = req.params.id;
    Categoria.findById(id)
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({ ok: false, err });
            }

            Categoria.count((err, cont) => {
                res.json({ ok: true, categorias, conteo: cont });
            });
        });
});

// ============================
// Crear nueva Categoria
// ============================
app.post("/categoria", verificaToken, (req, res) => {
    // Regresa la nueva Categoria
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });


    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
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

// ============================
// Actualizar categoria
// ============================
app.put("/categoria/:id", verificaToken, (req, res) => {
    // solo actualiza la descripción de la categoria
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({ ok: true, categoria: categoriaDB });
    });

});

// ============================
// Eliminar la categoria
// ============================
app.delete("/categoria/:id", [verificaToken, verificaAdmin_Role], (req, res) => {
    // solo un administrador puede borrar caegorias
    // Categoria.findByIdAndRemove

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({ ok: false, err: { message: 'Categoria no encontrada' } });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });
});

module.exports = app;