'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. 如果存在 id 列并且是 AUTO_INCREMENT，先删除它
    await queryInterface.removeColumn('Messages', 'id');

    // 2. 添加 messageID 列作为新的 AUTO_INCREMENT 主键
    await queryInterface.addColumn('Messages', 'messageID', {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 回滚操作：移除 messageID 列，并重新添加 id 列
    await queryInterface.removeColumn('Messages', 'messageID');
    await queryInterface.addColumn('Messages', 'id', {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    });
  }
};
