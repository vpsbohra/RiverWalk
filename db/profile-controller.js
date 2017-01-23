'use strict';

var pg = require('pg');
var crypto = require('crypto');
var config = require('./config');
var merchant = require('./../merchant/profiles');

var pool = new pg.Pool(config.pgConfig);

function encrypt(text) {
    var cipher = crypto.createCipher(config.algorithm, config.password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(config.algorithm, config.password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

// Testing connection here
pool.connect(function(err, client, done) {
    if (err) {
        return console.error('error fetching client from pool', err);
    }
    client.query('SELECT $1::int AS number', ['1'], function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if (err) {
            return console.error('error running query', err);
        }
        console.log(result.rows[0].number);
        //output: 1
    });
});

pool.on('error', function(err, client) {
    console.error('idle client error', err.message, err.stack)
});

module.exports = {
    checkRegister: function(req, res) {
        pool.connect(function(err, client, done) {
            if (err) {
                console.error(err);
                // should return response error like 
                return res.status(500).send();
            }
            var emailCheck = "select * from public.user WHERE email = $1";
            client.query(emailCheck, [req.body.email], function(err, result) {
                if (err) {
                    console.error(err);
                    res.status(500).send();
                    return done(); // always close connection
                }
                if (result.rowCount > 0) {
                    if (result.rows[0].ssn) {
                        result.rows[0].ssn = decrypt(result.rows[0].ssn);
                    }
                    var user = result.rows[0];
                    res.send(user);
                    return done(); // always close connection
                } else {
                    var emailInsert = "insert into public.user (user_auth_level, email, account_locked, contract, customer_id) " +
                        "values ($1, $2, $3, $4, $5) RETURNING *"
                    client.query(emailInsert, ["1", req.body.email, false, false, false], function(err, result) {
                        if (err) {
                            console.error(err);
                            res.status(500).send();
                            return done(); // always close connection
                        } else {
                            if (result.rowCount > 0) {
                                var user = result.rows[0]
                                res.send(user)
                                return done(); // always close connection
                            }
                        }

                    });
                }
            })
        })
        pool.on('error', function(err, client) {
            console.error('idle client error', err.message, err.stack)
        });
    },
    updateProfile: function(req, sqlRes) {
        pool.connect(function(err, client, done) {
            if (err) {
                console.error(err);
                // should return response error like 
                return sqlRes.status(500).send();
            }
            var encryptSSN = encrypt(req.body.ssn);
            // Setup the query
            var id = req.body.id;
            var email = req.body.email;
            var first_name = req.body.first_name;
            var middle_name = req.body.middle_name;
            var last_name = req.body.last_name;
            var dob = req.body.dob;
            var mobile_phone = req.body.mobile_phone;
            var home_phone = req.body.home_phone;
            var ssn = req.body.ssn;
            var street_address = req.body.street_address;
            var city_address = req.body.city_address;
            var state_address = req.body.state_address;
            var zip_address = req.body.zip_address;
            var customer_profile_id=req.body.customer_profile_id;
            merchant.createCustomerProfile(email, id, function callback(merchantRes){
                var sql = 'update public.user SET first_name = $3, middle_name = $4, last_name = $5, dob= $6, mobile_phone = $7, home_phone = $8, ssn = $9, street_address = $10, city_address = $11, state_address = $12, zip_address = $13, customer_id = $14, customer_profile_id = $15 WHERE id = $1 AND email = $2 RETURNING *';
                client.query(sql, [id, email, first_name, middle_name, last_name, dob, mobile_phone, home_phone, encryptSSN, street_address, city_address, state_address, zip_address, true, merchantRes.customerProfileId ], function(err, result) {
                    if (err) {
                        console.error(err);
                        sqlRes.status(500).send();
                        return done(); // always close connection
                    } else {
                        if (result.rowCount > 0) {
                            if (result.rows[0].ssn) {
                                result.rows[0].ssn = decrypt(result.rows[0].ssn);
                            }
                            var user = result.rows[0];
                            sqlRes.send(user);
                            // return your user
                            return done(); // always close connection
                        }
                    }

                });
            });
            pool.on('error', function(err, client) {
                console.error('idle client error', err.message, err.stack)
            });
        });
    },
    createPaymentMethod: function(req, res) {
        pool.connect(function (err, client, done) {
            if (err) {
                console.error(err);
                // should return response error like
                return res.status(500).send();
            }
            var id = req.body.id;
            var customerProfileId = req.body.customer_profile_id;
            var email = req.body.email;
            var firstName = req.body.firstName;
            var lastName = req.body.lastName;
            var cardNumber = req.body.cardNumber;
            var cardType = req.body.cardType;
            var cityAddress = req.body.city_address;
            var cvc = req.body.cvc;
            var expMonth = ('0' + (["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"].indexOf(req.body.expMonth.toLowerCase()) + 1)).slice(-2);
            var expYear = req.body.expYear.slice(2,4);
            var expDate = expMonth+expYear;
            var stateAddress = req.body.state_address;
            var streetAddress = req.body.street_address;
            var zipAddress = req.body.zip_address;
            // Setup the query
            console.log(req.body);
            merchant.createCustomerPaymentProfile(customerProfileId, cardNumber, expDate, firstName, lastName, streetAddress, cityAddress, stateAddress, zipAddress, function callback(merchantRes) {
                console.log(merchantRes);
                console.log("InsertData");
                var sql = "insert into public.credit_cards (user_id, user_email, customer_profile_id, customer_payment_profile_id) " +
                    "values ($1, $2, $3, $4) RETURNING *"
                client.query(sql, [id, email, customerProfileId, merchantRes.customerPaymentProfileId], function (err, result) {
                    if (err) {
                        console.error(err);
                        res.status(500).send();
                        return done(); // always close connection
                    } else {
                        if (result.rowCount > 0) {
                            var user = result.rows[0];
                            res.send(user);
                            // return your user
                            return done(); // always close connection
                        }
                    }

                });
            });
            pool.on('error', function (err, client) {
                console.error('idle client error', err.message, err.stack)
            });
        });
    }
};

//
// updateProfile: function(req, sqlRes) {
//     pool.connect(function(err, client, done) {
//         if (err) {
//             console.error(err);
//             // should return response error like
//             return res.status(500).send();
//         }
//         var encryptSSN = encrypt(req.body.ssn);
//         // Setup the query
//         var id = req.body.id;
//         var email = req.body.email;
//         var first_name = req.body.first_name;
//         var middle_name = req.body.middle_name;
//         var last_name = req.body.last_name;
//         var dob = req.body.dob;
//         var mobile_phone = req.body.mobile_phone;
//         var home_phone = req.body.home_phone;
//         var ssn = req.body.ssn;
//         var street_address = req.body.street_address;
//         var city_address = req.body.city_address;
//         var state_address = req.body.state_address;
//         var zip_address = req.body.zip_address;
//
//         var cardName = req.body.cardName;
//         var cardType = req.body.cardType;
//         var cardNumber = req.body.cardNumber;
//         var expMonth = ('0' + (["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"].indexOf(req.body.expMonth.toLowerCase()) + 1)).slice(-2);
//         var expYear = req.body.expYear.slice(2,4);
//         var cvc = req.body.cvc;
//         var expDate = expMonth+expYear;
//         merchant.createCustomerProfile(cardNumber, expDate, email, id, function callback(merchantRes){
//             var sql = 'update public.user SET first_name = $3, middle_name = $4, last_name = $5, dob= $6, mobile_phone = $7, home_phone = $8, ssn = $9, street_address = $10, city_address = $11, state_address = $12, zip_address = $13, customer_id = $14, customer_profile_id = $15 WHERE id = $1 AND email = $2 RETURNING *';
//             client.query(sql, [id, email, first_name, middle_name, last_name, dob, mobile_phone, home_phone, encryptSSN, street_address, city_address, state_address, zip_address, true, merchantRes.customerProfileId ], function(err, result) {
//                 if (err) {
//                     console.error(err);
//                     sqlRes.status(500).send();
//                     return done(); // always close connection
//                 } else {
//                     if (result.rowCount > 0) {
//                         if (result.rows[0].ssn) {
//                             result.rows[0].ssn = decrypt(result.rows[0].ssn);
//                         }
//                         var user = result.rows[0];
//                         sqlRes.send(user);
//                         // return your user
//                         return done(); // always close connection
//                     }
//                 }
//
//             });
//         });
//         pool.on('error', function(err, client) {
//             console.error('idle client error', err.message, err.stack)
//         });
//     });
// },


// merchant.createCustomerPaymentProfile(customerProfileId, function callback(merchantRes) {
//     var sql = 'update public.user SET first_name = $3, middle_name = $4, last_name = $5, dob= $6, mobile_phone = $7, home_phone = $8, ssn = $9, street_address = $10, city_address = $11, state_address = $12, zip_address = $13, customer_id = $14, customer_profile_id = $15 WHERE id = $1 AND email = $2 RETURNING *';
//     client.query(sql, [id, email, first_name, middle_name, last_name, dob, mobile_phone, home_phone, encryptSSN, street_address, city_address, state_address, zip_address, true, merchantRes.customerProfileId], function (err, result) {
//         if (err) {
//             console.error(err);
//             sqlRes.status(500).send();
//             return done(); // always close connection
//         } else {
//             if (result.rowCount > 0) {
//                 if (result.rows[0].ssn) {
//                     result.rows[0].ssn = decrypt(result.rows[0].ssn);
//                 }
//                 var user = result.rows[0];
//                 sqlRes.send(user);
//                 // return your user
//                 return done(); // always close connection
//             }
//         }
//
//     });
// });