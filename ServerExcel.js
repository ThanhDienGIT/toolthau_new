const http = require('node:http');
const express = require("express");
const { exportUser, exportData } = require('./Controller');
const hostname = '127.0.0.1';
const port = 5000;


const router = express();
router.get('/', (req, res) => {
    res.send('Welcome to Nodejs')
})
router.get('/test', exportUser)
router.get('/export', exportData)
router.listen(port, hostname, () => {
    console.log('run in http://' + hostname + ":" + port)
})


