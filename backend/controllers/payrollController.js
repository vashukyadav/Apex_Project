const puppeteer = require('puppeteer');
const moment = require('moment');
const { Payroll, Employee, Attendance } = require('../models');

const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.findAll({
      include: [{ model: Employee, attributes: ['firstName', 'lastName', 'employeeId'] }]
    });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyPayroll = async (req, res) => {
  try {
    const employee = await Employee.findOne({ where: { userId: req.user.id } });
    if (!employee) {
      return res.status(404).json({ message: 'Employee profile not found' });
    }

    const payrolls = await Payroll.findAll({
      where: { employeeId: employee.id },
      include: [{ model: Employee, attributes: ['firstName', 'lastName', 'employeeId'] }],
      order: [['year', 'DESC'], ['month', 'DESC']]
    });
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const generatePayroll = async (req, res) => {
  try {
    const { employeeId, month, year } = req.body;

    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Calculate working days and present days
    const startDate = moment(`${year}-${month}-01`);
    const endDate = startDate.clone().endOf('month');
    const workingDays = endDate.diff(startDate, 'days') + 1;

    const attendance = await Attendance.findAll({
      where: {
        employeeId,
        date: {
          [require('sequelize').Op.between]: [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
        }
      }
    });

    const presentDays = attendance.length;
    const basicSalary = employee.salary;
    const allowances = basicSalary * 0.2; // 20% allowances
    const deductions = basicSalary * 0.1; // 10% deductions
    const netSalary = (basicSalary + allowances - deductions) * (presentDays / workingDays);

    const payroll = await Payroll.create({
      employeeId,
      month,
      year,
      basicSalary,
      allowances,
      deductions,
      netSalary: netSalary.toFixed(2),
      workingDays,
      presentDays
    });

    res.status(201).json(payroll);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const generatePayslipPDF = async (req, res) => {
  try {
    const payroll = await Payroll.findByPk(req.params.id, {
      include: [{ model: Employee }]
    });

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found' });
    }

    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Payslip</h1>
            <p>Month: ${payroll.month}/${payroll.year}</p>
          </div>
          <div class="details">
            <p><strong>Employee:</strong> ${payroll.Employee.firstName} ${payroll.Employee.lastName}</p>
            <p><strong>Employee ID:</strong> ${payroll.Employee.employeeId}</p>
            <p><strong>Department:</strong> ${payroll.Employee.department}</p>
          </div>
          <table>
            <tr><th>Description</th><th>Amount</th></tr>
            <tr><td>Basic Salary</td><td>₹${payroll.basicSalary}</td></tr>
            <tr><td>Allowances</td><td>₹${payroll.allowances}</td></tr>
            <tr><td>Deductions</td><td>₹${payroll.deductions}</td></tr>
            <tr><td>Working Days</td><td>${payroll.workingDays}</td></tr>
            <tr><td>Present Days</td><td>${payroll.presentDays}</td></tr>
            <tr><th>Net Salary</th><th>₹${payroll.netSalary}</th></tr>
          </table>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=payslip-${payroll.Employee.employeeId}-${payroll.month}-${payroll.year}.pdf`);
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllPayrolls,
  getMyPayroll,
  generatePayroll,
  generatePayslipPDF
};