const { Offboarding, Employee, User } = require('../models');

const getAllOffboardings = async (req, res) => {
  try {
    const offboardings = await Offboarding.findAll({
      include: [{ model: Employee, attributes: ['firstName', 'lastName', 'employeeId'] }]
    });
    res.json(offboardings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const initiateOffboarding = async (req, res) => {
  try {
    const { employeeId, reason, lastWorkingDay, notes } = req.body;
    
    const offboarding = await Offboarding.create({
      employeeId,
      initiatedBy: req.user.id,
      reason,
      lastWorkingDay,
      notes
    });

    res.status(201).json(offboarding);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateOffboarding = async (req, res) => {
  try {
    const offboarding = await Offboarding.findByPk(req.params.id);
    
    if (!offboarding) {
      return res.status(404).json({ message: 'Offboarding record not found' });
    }

    await offboarding.update(req.body);
    res.json(offboarding);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const completeOffboarding = async (req, res) => {
  try {
    const offboarding = await Offboarding.findByPk(req.params.id);
    
    if (!offboarding) {
      return res.status(404).json({ message: 'Offboarding record not found' });
    }

    await offboarding.update({ status: 'completed' });
    
    // Deactivate employee
    const employee = await Employee.findByPk(offboarding.employeeId);
    if (employee) {
      await employee.update({ isActive: false });
    }

    res.json(offboarding);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllOffboardings,
  initiateOffboarding,
  updateOffboarding,
  completeOffboarding
};