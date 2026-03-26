import { User, TourPackage, Booking, Contact } from '../models/index.js';
import { Sequelize } from 'sequelize';

export const getDashboardStats = async (req, res) => {
  try {
    const isAgency = req.user.role === 'agency';
    const agencyId = req.user.id;

    let totalPackages, totalBookings, totalRevenue;

    if (isAgency) {
      // For agencies, count their own packages and bookings for those packages
      const [packageCount, bookingCount, revenueResult] = await Promise.all([
        TourPackage.count({ where: { agencyId } }),
        Booking.count({
          include: [{
            model: TourPackage,
            where: { agencyId },
            required: true
          }]
        }),
        Booking.findOne({
          where: { paymentStatus: 'paid' },
          attributes: [[Sequelize.fn('SUM', Sequelize.col('Booking.totalAmount')), 'totalRevenue']],
          include: [{
            model: TourPackage,
            where: { agencyId },
            required: true,
            attributes: []
          }],
          raw: true,
        }),
      ]);

      totalPackages = packageCount;
      totalBookings = bookingCount;
      totalRevenue = parseFloat(revenueResult?.totalRevenue || 0);

      return res.status(200).json({
        success: true,
        data: {
          totalPackages,
          totalBookings,
          totalRevenue,
        },
      });
    } else {
      // For admin (global stats)
      const [userCount, packageCount, bookingCount, contactCount, revenueResult] = await Promise.all([
        User.count(),
        TourPackage.count(),
        Booking.count(),
        Contact.count(),
        Booking.findOne({
          where: { paymentStatus: 'paid' },
          attributes: [[Sequelize.fn('SUM', Sequelize.col('totalAmount')), 'totalRevenue']],
          raw: true,
        }),
      ]);

      return res.status(200).json({
        success: true,
        data: {
          totalUsers: userCount,
          totalPackages: packageCount,
          totalBookings: bookingCount,
          totalContacts: contactCount,
          totalRevenue: parseFloat(revenueResult?.totalRevenue || 0),
        },
      });
    }
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching dashboard stats' });
  }
};


