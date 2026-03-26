import { AgencyRequest, User, Notification } from "../models/index.js";

// Customer submits an agency request
async function submitRequest(req, res) {
  try {
    const userId = req.user.id;

    // Only customers can submit
    if (req.user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Only customers can request agency registration.",
      });
    }

    // Check for existing pending request
    const existing = await AgencyRequest.findOne({
      where: { userId, status: "pending" },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending agency request.",
      });
    }

    const { agencyName, address, phone, description, licenseNumber } = req.body;

    if (!agencyName || !address || !phone || !description || !licenseNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: agencyName, address, phone, description, licenseNumber.",
      });
    }

    const request = await AgencyRequest.create({
      userId,
      agencyName,
      address,
      phone,
      description,
      licenseNumber,
    });

    res.status(201).json({
      success: true,
      message: "Agency request submitted successfully. You will be notified once it is reviewed.",
      data: request,
    });
  } catch (error) {
    console.error("submitRequest error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

// Customer checks their own request
async function getMyRequest(req, res) {
  try {
    const request = await AgencyRequest.findOne({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: request || null,
    });
  } catch (error) {
    console.error("getMyRequest error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

// Admin gets all agency requests
async function getAllRequests(req, res) {
  try {
    const requests = await AgencyRequest.findAll({
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: requests });
  } catch (error) {
    console.error("getAllRequests error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

// Admin approves or rejects a request
async function handleRequest(req, res) {
  try {
    const { id } = req.params;
    const { status, adminRemarks } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'approved' or 'rejected'.",
      });
    }

    const request = await AgencyRequest.findByPk(id, {
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found." });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This request has already been processed.",
      });
    }

    request.status = status;
    if (adminRemarks) request.adminRemarks = adminRemarks;
    await request.save();

    // If approved, upgrade user role to agency
    if (status === "approved") {
      await User.update({ role: "agency" }, { where: { id: request.userId } });
    }

    // Create notification for the user
    let notificationMessage;
    let notificationType;

    if (status === "approved") {
      notificationMessage = "Congratulations! Your agency registration for \"" + request.agencyName + "\" has been approved. You now have agency access.";
      notificationType = "agency_approved";
    } else {
      notificationMessage = "Your agency registration request for \"" + request.agencyName + "\" has been declined.";
      if (adminRemarks) {
        notificationMessage += " Reason: " + adminRemarks;
      }
      notificationType = "agency_rejected";
    }

    await Notification.create({
      userId: request.userId,
      message: notificationMessage,
      type: notificationType,
    });

    res.json({
      success: true,
      message: `Request ${status} successfully.`,
      data: request,
    });
  } catch (error) {
    console.error("handleRequest error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

export { submitRequest, getMyRequest, getAllRequests, handleRequest };
