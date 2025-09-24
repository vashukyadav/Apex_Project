const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Offboarding = sequelize.define('Offboarding', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Employees',
      key: 'id'
    }
  },
  initiatedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  reason: {
    type: DataTypes.ENUM('resignation', 'termination', 'retirement', 'contract_end'),
    allowNull: false
  },
  lastWorkingDay: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  exitInterviewCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  assetsReturned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  finalSettlementAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('initiated', 'in_progress', 'completed'),
    defaultValue: 'initiated'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'offboardings',
  timestamps: true
});

module.exports = Offboarding;