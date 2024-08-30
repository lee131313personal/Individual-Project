'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 添加 sentAt 列
    await queryInterface.addColumn('Messages', 'sentAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 回滚操作，移除 sentAt 列
    await queryInterface.removeColumn('Messages', 'sentAt');
  }
};
