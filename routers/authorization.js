var express = require('express');
var router = express.Router();
const authorizationService = require('../services/authorizationService')


router.get('/authorization', function (req, res) {
    authorizationService.authorization(req)
    .then(result => {
        req.session.username = result.account.username
        req.session.userId = result.account.id
        req.session.nickname = result.account.nickname
        res.status(200).json({code: result.code,  message: result.message, account: result.account})
    })
    .catch(err => {
        res.status(err.code? err.code:500).json({message: err.message})
    })
});


module.exports = router