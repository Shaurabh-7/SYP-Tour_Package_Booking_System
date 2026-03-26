import { Notification } from "../models/index.js";

// Get all notifications for the logged-in user
async function getMyNotifications(req, res) {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error("getMyNotifications error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

// Mark a single notification as read
async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({
      where: { id, userId: req.user.id },
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, data: notification });
  } catch (error) {
    console.error("markAsRead error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

// Mark all notifications as read
async function markAllAsRead(req, res) {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } }
    );

    res.json({ success: true, message: "All notifications marked as read." });
  } catch (error) {
    console.error("markAllAsRead error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

export { getMyNotifications, markAsRead, markAllAsRead };
