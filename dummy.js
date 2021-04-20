//table dummy
const Diet= sequelize.define('diet', {
    meal: Sequelize.STRING,
    calories: Sequelize.BIGINT,
    description: Sequelize.TEXT,
    followed: Sequelize.TINYINT
})