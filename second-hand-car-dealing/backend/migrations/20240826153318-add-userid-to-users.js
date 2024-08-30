'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 移除默认的 id 列
    await queryInterface.removeColumn('Users', 'id');

    // 添加 userID 列
    await queryInterface.addColumn('Users', 'userID', {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'userID');
    await queryInterface.addColumn('Users', 'id', {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    });
  }
};
