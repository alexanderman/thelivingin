const express = require('express');
const cors = require('cors');
const tildaRouter = require('./routes/tilda');
const clientRouter = require('./routes/client');
const adminRouter = require('./routes/admin');
require('./config'); /** preloading configuration */

const app = express();
app.use(cors({ origin: true }));

app.get('/', (req, res) => res.send('v0.0.1'));

app.use('/tilda', tildaRouter);
app.use('/client', clientRouter);
app.use('/admin', adminRouter);

/** SEED route ***********************************/
app.get('/__seeddb', (req, res, next) => {
    const seedProms = require('./_seed-database')();
    Promise.all(seedProms).then(_ => {
        res.send('seeded successfully');
    }).catch(next);
});
/*************************************************/

/** DEBUG route **********************************/
const firestore = require('./database/firestore');
app.get('/__db/:collection/:id?', (req, res, next) => {
    const { collection, id } = req.params;
    firestore._debugFetch(collection, id)
    .then(result => res.json(result))
    .catch(next);
});
/*************************************************/


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        error: err.message,
        fileName: err.fileName,
        lineNumber: err.lineNumber,
        columnNumber: err.columnNumber,
        stack: err.stack,
        name: err.name,
        _err: err
    });
});

module.exports = app;
