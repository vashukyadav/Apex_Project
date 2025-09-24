const moment = require('moment');
const { Attendance, Employee } = require('../models');

const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findAll({
      include: [{ model: Employee, attributes: ['firstName', 'lastName', 'employeeId'] }]
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const employee = await Employee.findOne({ where: { userId: req.user.id } });
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const attendance = await Attendance.findAll({
      where: { employeeId: employee.id },
      order: [['date', 'DESC']]
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const checkIn = async (req, res) => {
  try {
    const employee = await Employee.findOne({ where: { userId: req.user.id } });
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const today = moment().format('YYYY-MM-DD');
    const currentTime = moment().format('HH:mm:ss');

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      where: { employeeId: employee.id, date: today }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const attendance = await Attendance.create({
      employeeId: employee.id,
      date: today,
      checkIn: currentTime
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const checkOut = async (req, res) => {
  try {
    const employee = await Employee.findOne({ where: { userId: req.user.id } });
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const today = moment().format('YYYY-MM-DD');
    const currentTime = moment().format('HH:mm:ss');

    const attendance = await Attendance.findOne({
      where: { employeeId: employee.id, date: today }
    });

    if (!attendance) {
      return res.status(400).json({ message: 'No check-in record found for today' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    // Calculate working hours
    const checkInTime = moment(attendance.checkIn, 'HH:mm:ss');
    const checkOutTime = moment(currentTime, 'HH:mm:ss');
    const workingHours = checkOutTime.diff(checkInTime, 'hours', true);

    await attendance.update({
      checkOut: currentTime,
      workingHours: workingHours.toFixed(2)
    });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllAttendance,
  getMyAttendance,
  checkIn,
  checkOut
};