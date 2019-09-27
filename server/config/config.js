// ======================
// Puerto
// ======================

process.env.PORT = process.env.PORT || 3000;


// ======================
// Entorno
// ======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ======================
// Vencimiento del Token
// ======================
// 60 seg
// 60 min 
// 24 horas
// 30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ======================
// SEED o semilla de autenticación
// ======================

process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";

// ======================
// base de datos
// ======================

let urlDB; // jshint ignore:line

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ======================
// Google ID  Client
// ======================

process.env.CLIENT_ID = process.env.CLIENT_ID || "992534703255-r98cdicomimgbfuvmpth4vr1dhq98dok.apps.googleusercontent.com";