const express = require('express');

const fileUpload = require('express-fileupload');

const app = express();

//Cuando se llame file Uploasds todos los archivos se cargan en el req.files
app.use(fileUpload());

app.put('/uploads', function(req, res) {

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    // recive el archivo mediante nuestra variable archivo
    let archivo = req.files.archivo;

    archivo.mv('server/uploads/filname.jpg', (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'subida correctamente'
        })
    })

})


module.exports = app;