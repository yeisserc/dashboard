const bcrypt = require('bcrypt');
var prompt = require('prompt-sync')();

// const db = require('./databases/cpa2017');
const saltRounds = 10;

// let user = prompt('Ingrese el User: ');
let pass = prompt('Ingrese el password: ');

bcrypt.hash(pass, saltRounds, function(err, hash) {

    if(err) {
        console.log(err);
        process.exit(0);
    }

    console.log(hash);
});