const redis = require('../database/redis')
const WebSocket = require('ws');
const conf = require('../config/')

module.exports= function(wss, data){
    var userId = data.session ? data.session.userId: data.userId
    redis.get(conf.redisCache.playerPrefix + userId, function(err, res){
        if (err) {return console.error('error redis response - ' + err)}
        redis.del(conf.redisCache.sessionPrefix + data.sessionID, function(err){
            if (err) {return console.error('error redis response - ' + err)}
            redis.del(conf.redisCache.playerPrefix + userId, function(err){
                if (err) {return console.error('error redis response - ' + err)}
                redis.keys(conf.redisCache.playerPrefix + '*', function(err, list){
                    if (err) {return console.error('error redis response - ' + err)}
                    if (list.length > 0){
                        redis.mget(list, function(err, playerList){
                            if (err) {return console.error('error redis response - ' + err)}
                            wss.clients.forEach(function each(client) {
                                if (client.readyState === WebSocket.OPEN) {
                                    client.send(JSON.stringify({type: 'playerList', data: playerList}));
                                    client.send(JSON.stringify({type: 'system', player_loc: 0 , text: '玩家 ' + JSON.parse(res).nickname + ' 下线了'}))
                                    if(res.player_loc > 0){
                                        client.send(JSON.stringify({type: 'system', player_loc: res.player_loc , text: '玩家 ' + JSON.parse(res).nickname + ' 退出了房间'}))
                                    }
                                }
                            })
                        })
                    }
                })
            })
        })
    })
}