import Booking from "../models/booking.js";
import TourPackage from "../models/tourpackage.js";
import User from "../models/user.js";
import {
  sendBookingCancelledEmail,
  sendBookingCompletedEmail,
  sendBookingCreatedEmail,
  sendBookingUpdatedEmail,
} from "../services/notificationService.js";

const createBooking = async (req, res) => {
  try {
    const { packageId, numberOfPeople } = req.body;

    if (!packageId) {
      return res.status(400).json({
        success: false,
        message: "Package ID is required",
      });
    }

    const pkg = await TourPackage.findByPk(packageId);
    if (!pkg || !pkg.isActive) {
      return res.status(404).json({
        success: false,
        message: "Package not found or inactive",
      });
    }

    const people = numberOfPeople ? parseInt(numberOfPeople, 10) : 1;
    const totalAmount = parseFloat(pkg.price) * people;

    const booking = await Booking.create({
      userId: req.user.id,
      packageId,
      numberOfPeople: people,
      totalAmount,
    });

    try {
      await sendBookingCreatedEmail({
        user: req.user,
        booking,
        tourPackage: pkg,
      });
    } catch (emailError) {
      console.error("Booking created email error:", emailError.message);
    }

    const full = await Booking.findByPk(booking.id, {
      include: [
        { model: TourPackage, as: "TourPackage", attributes: ["id", "name", "price", "destination"] },
        { model: User, as: "User", attributes: ["id", "name", "email"] },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Booking created",
      data: full,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: error.message,
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const where = {};
    if (req.user.role === "customer") {
      where.userId = req.user.id;
    } else if (req.user.role === "agency") {
      const pkgs = await TourPackage.findAll({ where: { agencyId: req.user.id }, attributes: ["id"] });
      where.packageId = pkgs.map((p) => p.id);
    }

    const bookings = await Booking.findAll({
      where,
      include: [
        { model: TourPackage, as: "TourPackage", attributes: ["id", "name", "price", "destination", "agencyId"] },
        { model: User, as: "User", attributes: ["id", "name", "email"] },
      ],
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id, {
      include: [
        { model: TourPackage, as: "TourPackage" },
        { model: User, as: "User", attributes: ["id", "name", "email"] },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (req.user.role === "customer" && booking.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    if (req.user.role === "agency" && booking.TourPackage?.agencyId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching booking",
      error: error.message,
    });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findByPk(id, {
      include: [{ model: TourPackage, as: "TourPackage" }],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (req.user.role === "customer" && booking.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only update your own bookings" });
    }
    if (req.user.role === "agency" && booking.TourPackage?.agencyId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const updates = {};
    if (status !== undefined) updates.status = status;
    if (paymentStatus !== undefined) updates.paymentStatus = paymentStatus;
    updates.updatedAt = new Date();

    await booking.update(updates);

    const user = await User.findByPk(booking.userId, {
      attributes: ["id", "name", "email"],
    });

    if (user) {
      try {
        if (updates.status === "cancelled") {
          await sendBookingCancelledEmail({
            user,
            booking,
            tourPackage: booking.TourPackage,
          });
        } else if (updates.status === "completed") {
          await sendBookingCompletedEmail({
            user,
            booking,
            tourPackage: booking.TourPackage,
          });
        } else {
          await sendBookingUpdatedEmail({
            user,
            booking,
            tourPackage: booking.TourPackage,
          });
        }
      } catch (emailError) {
        console.error("Booking update email error:", emailError.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Booking updated",
      data: booking,
    });
  } catch (error) {
    console.error("Update booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating booking",
      error: error.message,
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id, {
      include: [{ model: TourPackage, as: "TourPackage" }],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (req.user.role === "customer" && booking.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only delete your own bookings" });
    }
    if (req.user.role === "agency" && booking.TourPackage?.agencyId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const user = await User.findByPk(booking.userId, {
      attributes: ["id", "name", "email"],
    });

    if (user) {
      try {
        await sendBookingCancelledEmail({
          user,
          booking,
          tourPackage: booking.TourPackage,
        });
      } catch (emailError) {
        console.error("Booking delete email error:", emailError.message);
      }
    }

    await booking.destroy();
    return res.status(200).json({
      success: true,
      message: "Booking deleted",
    });
  } catch (error) {
    console.error("Delete booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting booking",
      error: error.message,
    });
  }
};

export { createBooking, getAllBookings, getBookingById, updateBooking, deleteBooking };
