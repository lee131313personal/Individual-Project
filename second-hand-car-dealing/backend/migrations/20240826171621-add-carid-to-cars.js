'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 如果存在 id 列且为 AUTO_INCREMENT，需要先删除它
    await queryInterface.removeColumn('Cars', 'id');

    // 添加 carID 列作为新的 AUTO_INCREMENT 主键
    await queryInterface.addColumn('Cars', 'carID', {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 回滚操作：移除 carID 列，并重新添加 id 列
    await queryInterface.removeColumn('Cars', 'carID');
    await queryInterface.addColumn('Cars', 'id', {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    });
  }
};