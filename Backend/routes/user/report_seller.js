const express = require('express');
const router = express.Router();
const SellerReport = require('../../models/SellerReport');
const authMiddleware = require('../../middleware/authMiddleware')
const ResponseService = require('../../services/responses');
const User = require('../../models/User');

// Create a new report
router.post('/create', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    const { seller_id, subject, message } = req.body;

    //check seller
    const seller = await User.findById(seller_id);
    if(!seller){
        return ResponseService.badRequest(res, 'Seller not found');
    }
    if(message == null){
        return ResponseService.badRequest(res, 'Details of your report is required');
    }
    if(message.length > 5000){
        return ResponseService.badRequest(res, 'Details of your report too long');
    }
    
    try {
      const newSellerReport = new SellerReport({
        user_id: userId,
        seller_id,
        subject,
        message
      });
  
      await newSellerReport.save();
      return ResponseService.success(res, newSellerReport, 'Report added successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error adding report');
    }
  });

  // Get all reports by user Id
router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;  
    try {
      const reports = await SellerReport.find({user_id: userId})
        .sort({ createdAt: -1 })
.skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('seller_id'); 
  
      const totalSellerReports = await SellerReport.countDocuments({user_id: userId});
      const totalPages = Math.ceil(totalSellerReports / limit);
  
      return ResponseService.success(res, {
        reports,
        currentPage: parseInt(page),
        totalPages,
        totalSellerReports,
      }, 'Reports fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching reports');
    }
  });

  // Delete a report
router.delete('/:id', authMiddleware, async (req, res) => {
    const reportId = req.params.id;
    const userId = req.user.userId;
    try {
      const report = await SellerReport.findById(reportId);
      if (!report) {
        return ResponseService.notFound(res, 'Report not found');
      }

      //check if user own review
      if(review.user_id != userId){
        return ResponseService.notFound(res, 'You cannot delete a report you did not created');
      }
  
      await report.remove();
      return ResponseService.success(res, {}, 'Report removed successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error removing report');
    }
  });
  
  module.exports = router;