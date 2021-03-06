const models = require('../common/models')

module.exports = {
    register: async function(data){
        try{
            const InvitationCode = models.invitationCode
            const Account = models.account
            var invitationCodes = await InvitationCode.findAll({where: {invitation_code: data.inviteCode}})
            if(invitationCodes.length === 0){
                return Promise.resolve({code: 406, message: '邀请码不存在，请重新确认'})
            }
            else if(invitationCodes[0].is_used){
                return Promise.resolve({code: 406, message: '邀请码已使用，请重新输入'})
            }
            else{
                var accounts = await Account.findAll({where:{username : data.name}})
                if(accounts.length === 0){
                    var newAccount = await Account.create({username: data.name, password: data.pass})
                    invitationCodes[0].is_used = true
                    invitationCodes[0].player_id = newAccount.id
                    await invitationCodes[0].save()
                    return Promise.resolve({code: 200 , message: ''})
                }
                else{
                    return Promise.resolve({code: 406 , message: '用户名已被用，请重新输入'})
                }
            }
        }
        catch(err){
            return Promise.reject({message: err})
        }
       
    }
}