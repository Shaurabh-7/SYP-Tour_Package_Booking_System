import TourPackage from "../models/tourpackage.js";
import User from "../models/user.js";

const normalizeImageUrl = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return null;

  const trimmedValue = value.trim();
  return trimmedValue === "" ? null : trimmedValue;
};

// Create package - agencyId is automatically set from logged-in user
const createPackage = async (req, res) => {
  try {
    const { name, description, price, durationDays, destination, imageUrl } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    const normalizedImageUrl = normalizeImageUrl(imageUrl);

    if (imageUrl !== undefined && imageUrl !== null && typeof imageUrl !== "string") {
      return res.status(400).json({
        success: false,
        message: "Image URL must be a valid string",
      });
    }

    const packageData = await TourPackage.create({
      name,
      description: description || null,
      price,
      durationDays: durationDays || null,
      destination: destination || null,
      imageUrl: normalizedImageUrl ?? null,
      agencyId: req.user.id, // Automatically assigned from logged-in agency
    });

    return res.status(201).json({
      success: true,
      message: "Package created",
      data: packageData,
    });
  } catch (error) {
    console.error("Create package error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating package",
      error: error.message,
    });
  }
};

const getAllPackages = async (req, res) => {
  try {
    const where = {};
    if (req.user?.role === "agency") {
      where.agencyId = req.user.id;
    } else if (req.user?.role !== "admin") {
      where.isActive = true;
    }
    const packages = await TourPackage.findAll({
      where,
      include: [{ model: User, as: "agency", attributes: ["id", "name", "email"], required: false }],
      order: [["id", "DESC"]],
    });
    return res.status(200).json({
      success: true,
      data: packages,
    });
  } catch (error) {
    console.error("Get packages error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching packages",
      error: error.message,
    });
  }
};

const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await TourPackage.findByPk(id, {
      include: [{ model: User, as: "agency", attributes: ["id", "name", "email"] }],
    });
    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }
    if (req.user?.role === "agency" && pkg.agencyId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    return res.status(200).json({
      success: true,
      data: pkg,
    });
  } catch (error) {
    console.error("Get package error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching package",
      error: error.message,
    });
  }
};

const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, durationDays, destination, imageUrl, isActive } = req.body;

    const pkg = await TourPackage.findByPk(id);
    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }
    if (req.user.role === "agency" && pkg.agencyId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own packages",
      });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = price;
    if (durationDays !== undefined) updates.durationDays = durationDays;
    if (destination !== undefined) updates.destination = destination;
    if (imageUrl !== undefined) {
      const normalizedImageUrl = normalizeImageUrl(imageUrl);

      if (imageUrl !== null && typeof imageUrl !== "string") {
        return res.status(400).json({
          success: false,
          message: "Image URL must be a valid string",
        });
      }

      updates.imageUrl = normalizedImageUrl;
    }
    if (isActive !== undefined && (req.user.role === "admin" || req.user.role === "agency")) updates.isActive = isActive;
    updates.updatedAt = new Date();

    await pkg.update(updates);

    return res.status(200).json({
      success: true,
      message: "Package updated",
      data: pkg,
    });
  } catch (error) {
    console.error("Update package error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating package",
      error: error.message,
    });
  }
};

const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await TourPackage.findByPk(id);
    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }
    if (req.user.role === "agency" && pkg.agencyId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own packages",
      });
    }
    await pkg.destroy();
    return res.status(200).json({
      success: true,
      message: "Package deleted",
    });
  } catch (error) {
    console.error("Delete package error:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting package",
      error: error.message,
    });
  }
};

export { createPackage, getAllPackages, getPackageById, updatePackage, deletePackage };
