
const {Sequelize, DataTypes} = require('sequelize');
const conf = require('../config/config-development.js');
const dbConf = conf.mysql

var sequelize = new Sequelize(dbConf.database, dbConf.username, dbConf.password, {
    host: dbConf.host,
    dialect: 'mysql',
    port: dbConf.port,
    pool: {
        max: dbConf.pool.max,
        min: dbConf.pool.min,
        idle: dbConf.pool.idle,
    },
    timezone: dbConf.timezone
})

module.exports = {
    defineModel: function(name, attributes) {
        var attrs = {};
        for (let key in attributes) {
            let value = attributes[key];
            if (typeof value === 'object' && value['type']) {
                value.allowNull = value.allowNull || false;
                attrs[key] = value;
            } else {
                attrs[key] = {
                    type: DataTypes[value],
                    allowNull: false
                };
            }
        }
        attrs.id = {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        };
        attrs.version = {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0
        };
        return sequelize.define(name, attrs, {
            tableName: name,
            timestamps: true,
            hooks: {
                beforeValidate: function (obj) {
                    if (!obj.version) {
                        obj.version = 0;
                    } else {
                        obj.version++;
                    }
                }
            }
        });
    },

    sync: async function(){
        await sequelize.sync()
    },

    dataTypes: DataTypes

}