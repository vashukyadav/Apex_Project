const bcrypt = require('bcryptjs');
const { Employee, User } = require('../models');

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [{ model: User, attributes: ['email', 'role'] }]
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['email', 'role'] }]
    });
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const {
      employeeId, firstName, lastName, email, phone,
      department, position, salary, joinDate, password
    } = req.body;

    // Create user account
    const hashedPassword = await bcrypt.hash(password || 'password123', 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      role: 'employee'
    });

    // Create employee profile
    const employee = await Employee.create({
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      department,
      position,
      salary,
      joinDate,
      userId: user.id
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.update(req.body);
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.update({ isActive: false });
    await User.update({ isActive: false }, { where: { id: employee.userId } });
    
    res.json({ message: 'Employee deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
};