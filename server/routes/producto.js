/*jshint esversion: 6 */
const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

const _ = require("underscore");
const Producto = require('../models/producto');
const app = express();


// ===========================
//  Obtener productos
// ===========================
app.get('/producto', verificaToken, (req, res) => {
    // traer todos los productos
    // populate: usuario categoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res
                    .status(500)
                    .json({
                        ok: false,
                        err
                    });
            }

            res.json({
                ok: true,
                productos
            });
        });


});

// ===========================
//  Obtener un producto por ID
// ===========================
app.get('/producto/:id', verificaToken, (req, res) => {
    // populate: usuario categoria

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res
                    .status(500)
                    .json({
                        ok: false,
                        err
                    });
            }

            if (!producto) {
                return res
                    .status(400)
                    .json({
                        ok: false,
                        err: {
                            message: "ID no existe"
                        }
                    });
            }

            res.json({
                ok: true,
                producto
            });
        });


});


// ===========================
//  Crear Productos
// ===========================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    //Expresión regular la cual conside con minusculas y mayusculas por la i que se le envia
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex, disponible: true })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res
                    .status(500)
                    .json({
                        ok: false,
                        err
                    });
            }


            res.json({
                ok: true,
                productos
            });
        });

});

// ===========================
//  Crear Productos
// ===========================
app.post('/producto', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar la categoria del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

// ===========================
//  Actualizar Productos
// ===========================
app.put('/producto/:id', verificaToken, (req, res) => {
    // Actualizar Producto
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
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Producto no encontrado"
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });


    });

});

// ===========================
//  Eliminar Productos
// ===========================
app.delete('/producto/:id', verificaToken, (req, res) => {
    // cambiar estado a disponible

    let id = req.params.id;
    let cambiarEstado = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambiarEstado, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Producto no encontrado"
                }
            });
        }


        res.json({
            ok: true,
            message: "Producto borrado exitosamente"
        });
    });

});


module.exports = app;