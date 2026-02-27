import Package from "../models/package.js";

export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.findAll();
    return res.status(200).json({ success: true, data: packages });
  } catch (error) {
    console.error("Get packages error:", error);
    return res.status(500).json({ success: false, message: "Error fetching packages" });
  }
};
