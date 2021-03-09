var conf = require('../config/')

module.exports = function(req, res, next){
    res.header('Access-Control-Allow-Origin', conf.frontOrigin)
    res.header('Access-Control-Allow-Headers', conf.httpHeaders.allowHeaders)
    res.header('Access-Control-Allow-Methods', conf.httpHeaders.allowMethods)
    res.header('Access-Control-Allow-Credentials', conf.httpHeaders.allowCredentials)
    if(req._parsedUrl.path.indexOf('/login') !== -1 || req._parsedUrl.path.indexOf('/register') !== -1){
        next()
    }
    else{
        if(req.session.username){
            if(req._parsedUrl.path.indexOf('/authorization') !== -1 ){
                res.status(200).json({code: 200,  message: ''})
                return
            }
            next()
        }
        else{
            res.status(200).json({code: 401,  message: ''})
        }
    }
}