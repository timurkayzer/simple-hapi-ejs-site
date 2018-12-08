const Sequelize = require('sequelize')

const sequelize = new Sequelize('hapi_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const Page = sequelize.define('page', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    slug: Sequelize.TEXT,
    title: Sequelize.TEXT,
    full_text: Sequelize.TEXT,
},
    {
        timestamps: false
    });

module.exports = Page