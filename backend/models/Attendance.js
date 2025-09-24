const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
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
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  checkIn: {
    type: DataTypes.TIME,
    allowNull: false
  },
  checkOut: {
    type: DataTypes.TIME
  },
  workingHours: {
    type: DataTypes.DECIMAL(4, 2),
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'half-day'),
    defaultValue: 'present'
  }
});

module.exports = Attendance;