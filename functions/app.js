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

/** DEBUG route **********************************/
const firestore = require('./database/firestore');
app.get('/__db/:collection/:id?', (req, res) => {
    const { collection, id } = req.params;
    firestore._debugFetch(collection, id)
    .then(result => res.json(result))
    .catch(err => res.status(500).send(err));
});
/*************************************************/


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        error: err.message
    });
});

module.exports = app;
