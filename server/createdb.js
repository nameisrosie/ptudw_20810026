const models = require('./src/models');
models.sequelize.sync({ force: true })
  .then(() => {
    console.log('Database & tables created!');
  });