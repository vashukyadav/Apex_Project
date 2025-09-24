const { Notification } = require('../models');

const getMyNotifications = async (req, res) => {
  try {
    console.log('Getting notifications for user:', req.user.id);
    
    // Create a test notification if none exist
    const existingCount = await Notification.count({ where: { userId: req.user.id } });
    if (existingCount === 0) {
      await Notification.create({
        userId: req.user.id,
        type: 'attendance_alert',
        title: 'Welcome to HRMS',
        message: 'Welcome to the notification system! You will receive updates here.',
        isRead: false
      });
    }
    
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    console.log('Found notifications:', notifications.length);
    res.json(notifications);
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    
    if (!notification || notification.userId !== req.user.id) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.update({ isRead: true });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createNotification = async (userId, type, title, message, relatedId = null) => {
  try {
    return await Notification.create({
      userId,
      type,
      title,
      message,
      relatedId
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  createNotification
};