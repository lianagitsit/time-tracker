'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'display_name', Sequelize.STRING);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'display_name');
  }
};
