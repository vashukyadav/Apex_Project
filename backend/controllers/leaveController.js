const { Leave, Employee, User } = require('../models');
const { createNotification } = require('./notificationController');

const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      include: [{ model: Employee, attributes: ['firstName', 'lastName', 'employeeId'] }]
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyLeaves = async (req, res) => {
  try {
    const employee = await Employee.findOne({ where: { userId: req.user.id } });
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const leaves = await Leave.findAll({
      where: { employeeId: employee.id },
      include: [{ model: Employee, attributes: ['firstName', 'lastName', 'employeeId'] }]
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const applyLeave = async (req, res) => {
  try {
    const employee = await Employee.findOne({ where: { userId: req.user.id } });
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const { leaveType, startDate, endDate, reason } = req.body;

    const leave = await Leave.create({
      employeeId: employee.id,
      leaveType,
      startDate,
      endDate,
      reason
    });

    // Create notification for leave application
    await createNotification(
      req.user.id,
      'attendance_alert',
      'Leave Application Submitted',
      `Your ${leaveType} leave request from ${startDate} to ${endDate} has been submitted and is pending approval.`,
      leave.id
    );

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id, {
      include: [{ model: Employee, include: [{ model: User }] }]
    });
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    await leave.update({
      status: 'approved',
      approvedBy: req.user.id,
      approvedAt: new Date()
    });

    // Create notification
    if (leave.Employee?.User) {
      await createNotification(
        leave.Employee.User.id,
        'leave_approved',
        'Leave Request Approved',
        `Your ${leave.leaveType} leave request from ${leave.startDate} to ${leave.endDate} has been approved.`,
        leave.id
      );
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id, {
      include: [{ model: Employee, include: [{ model: User }] }]
    });
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    await leave.update({
      status: 'rejected',
      approvedBy: req.user.id,
      approvedAt: new Date()
    });

    // Create notification
    if (leave.Employee?.User) {
      await createNotification(
        leave.Employee.User.id,
        'leave_rejected',
        'Leave Request Rejected',
        `Your ${leave.leaveType} leave request from ${leave.startDate} to ${leave.endDate} has been rejected.`,
        leave.id
      );
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const clearAllLeaves = async (req, res) => {
  try {
    await Leave.destroy({ where: {} });
    res.json({ message: 'All leave records cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const clearMyLeaves = async (req, res) => {
  try {
    const employee = await Employee.findOne({ where: { userId: req.user.id } });
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    await Leave.destroy({ where: { employeeId: employee.id } });
    res.json({ message: 'Your leave records cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllLeaves,
  getMyLeaves,
  applyLeave,
  approveLeave,
  rejectLeave,
  clearAllLeaves,
  clearMyLeaves
};