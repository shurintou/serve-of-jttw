var express = require('express')
var router = express.Router()
const authorizationService = require('../services/authorizationService')
const sessionHandler = require('../common/session').sessionHandler
const logger = require('../common/log')


router.get('/authorization', function (req, res) {
    authorizationService.authorization(req)
    .then(result => {
        sessionHandler(req, result.account)
        res.status(200).json({code: result.code,  message: result.message, account: result.account})
    })
    .catch(err => {
        logger.error(err.message)
        res.status(err.code? err.code:500).json({message: err.message})
    })
})


module.exports = router