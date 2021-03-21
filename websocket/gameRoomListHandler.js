const redis = require('../database/redis')
const WebSocket = require('ws');
const conf = require('../config/')
const errors = require('../common/errors')

module.exports = function(data ,wss, ws){
    var allRooms = conf.redisCache.gameRoomPrefix + '*'
    /* id是0则直接获取现在的游戏房间列表 */
    if(data.id === 0){
        redis.keys(allRooms, function(err, list){
            if (err) {return console.error('error redis response - ' + err)}
            if(list.length === 0){ 
                ws.send(JSON.stringify({type: 'gameRoomList', data: [] }));
                return 
            }
            redis.mget(list, function(err, gameRoomList){
                if (err) {return console.error('error redis response - ' + err)}
                ws.send(JSON.stringify({type: 'gameRoomList', data: gameRoomList}));
            })
        })
    }
    /* id位NaN是新建的房间，需要分配一个id */
    else if(data.id === null || data.id === NaN){
        redis.keys(allRooms, function(err, list){
            if (err) {return console.error('error redis response - ' + err)}
            var idOfList = []
            list.forEach( item => { idOfList.push(parseInt(item.split(conf.redisCache.gameRoomPrefix)[1]))})
            idOfList.sort()
            /* 分配的房间号 */
            var freeIndex = 0
            for(var i = 0; i < idOfList.length; i++){
                if( idOfList[i] !== i + 1 ){
                    freeIndex = i + 1
                    break
                }
            }
            if(freeIndex === 0){ freeIndex = idOfList.length + 1 }
            redis.set(conf.redisCache.gameRoomPrefix + freeIndex, JSON.stringify({
            id: freeIndex,
            name: data.name,
            status: data.status,
            needPassword: data.needPassword,
            password: data.password,
            cardNum: data.cardNum,
            owner: data.owner,
            playerList: data.playerList
            }), 
            function(err){
                if (err) {return console.error('error redis response - ' + err)}
                list.push(conf.redisCache.gameRoomPrefix + freeIndex)
                redis.mget(list, function(err, gameRoomList){
                    if (err) {return console.error('error redis response - ' + err)}
                    wss.clients.forEach(function each(client) {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({type: 'gameRoomList', data: gameRoomList}));
                        }
                    });
                })
            })
        })        
    }
    else if(data.id < 0){
        let roomId = conf.redisCache.gameRoomPrefix + (-1 * data.id)
        /* 小于0，某玩家离开了房间 */
        redis.get(roomId, function(err, res){
            if (err) {return console.error('error redis response - ' + err)}
            let room = JSON.parse(res)
            let deleteId = room.playerList[data.seatIndex].id
            let remainId = 0
            /* 删掉离开的玩家 */
            room.playerList[data.seatIndex] = {id: 0, cards: 0, ready: false}
            let stillHasPlayer = false
            for( let i = 0; i < Object.keys(room.playerList).length; i++){
                if(room.playerList[i].id !== 0){
                    stillHasPlayer = true
                    remainId = room.playerList[i].id
                    break
                }
            }
            /* 如果还有玩家在房间中则保留房间并广播 */
            if(stillHasPlayer){
                /* 如果退出的是房主则换房主 */
                if(room.owner === deleteId){
                    room.owner = remainId
                    redis.get(conf.redisCache.playerPrefix + remainId, function(err, res){
                        if (err) {return console.error('error redis response - ' + err)}
                        wss.clients.forEach(function each(client) {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({type: 'system', player_loc: (-1 * data.id) , text: '玩家 ' + JSON.parse(res).nickname + ' 成为了房主'}));
                            }
                        })
                    })
                }
                redis.set(roomId, JSON.stringify(room), function(err){
                    if (err) {return console.error('error redis response - ' + err)}
                    redis.keys(allRooms, function(err, list){
                        if (err) {return console.error('error redis response - ' + err)}
                        if(list.length === 0){ 
                            wss.clients.forEach(function each(client) {
                                if (client.readyState === WebSocket.OPEN) {
                                    client.send(JSON.stringify({type: 'gameRoomList', data: [] }));
                                }
                            })
                            return
                        }
                        redis.mget(list, function(err, gameRoomList){
                            if (err) {return console.error('error redis response - ' + err)}
                            wss.clients.forEach(function each(client) {
                                if (client.readyState === WebSocket.OPEN) {
                                    client.send(JSON.stringify({type: 'gameRoomList', data: gameRoomList}));
                                }
                            });
                        })
                    })
                })
            }
            /* 否则删除房间并广播 */
            else{
                redis.del(roomId, function(err){
                    if (err) {return console.error('error redis response - ' + err)}
                    redis.keys(allRooms, function(err, list){
                        if (err) {return console.error('error redis response - ' + err)}
                        if(list.length === 0){ 
                            wss.clients.forEach(function each(client) {
                                if (client.readyState === WebSocket.OPEN) {
                                    client.send(JSON.stringify({type: 'gameRoomList', data: [] }));
                                }
                            })
                            return
                        }
                        redis.mget(list, function(err, gameRoomList){
                            if (err) {return console.error('error redis response - ' + err)}
                            wss.clients.forEach(function each(client) {
                                if (client.readyState === WebSocket.OPEN) {
                                    client.send(JSON.stringify({type: 'gameRoomList', data: gameRoomList}));
                                }
                            });
                        })
                    })
                })
            }
        })
    }
    /* 大于0，属于对某个房间的操作 */
    else{
        let roomId = conf.redisCache.gameRoomPrefix + data.id
        /* 加入房间 */
        if(data.action === 'enter'){
            redis.get(roomId, function(err, res){
                if (err) {return console.error('error redis response - ' + err)}
                let room = JSON.parse(res)
                let freeSeatIndex = -1
                for( let i = 0; i < Object.keys(room.playerList).length; i++){
                    if(room.playerList[i].id === 0 ){
                        freeSeatIndex = i
                        break
                    }
                }
                if(freeSeatIndex === -1){
                    ws.send(JSON.stringify({type: 'error', player_loc: 0 , text: errors.ROOM_FULL.message}))
                    return
                }
                if(room.needPassword){
                    if(data.password !== room.password){
                        ws.send(JSON.stringify({type: 'error', player_loc: 0 , text: errors.WRONG_PASSWORD.message}))
                        return
                    }
                }
                room.playerList[freeSeatIndex] = {id: ws.userId, cards: 0, ready: false}
                redis.set(roomId, JSON.stringify(room), function(err){
                    if (err) {return console.error('error redis response - ' + err)}
                    redis.keys(allRooms, function(err, list){
                        if (err) {return console.error('error redis response - ' + err)}
                        if(list.length === 0){ 
                            wss.clients.forEach(function each(client) {
                                if (client.readyState === WebSocket.OPEN) {
                                    client.send(JSON.stringify({type: 'gameRoomList', data: [] }));
                                }
                            })
                            return
                        }
                        redis.mget(list, function(err, gameRoomList){
                            if (err) {return console.error('error redis response - ' + err)}
                            wss.clients.forEach(function each(client) {
                                if (client.readyState === WebSocket.OPEN) {
                                    client.send(JSON.stringify({type: 'gameRoomList', data: gameRoomList}));
                                }
                            });
                        })
                    })
                })
            })
        }
    }
    
}