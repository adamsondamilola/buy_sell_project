const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const adminAuthMiddleware = require('../../middleware/adminAuthMiddleware');
const ResponseService = require('../../services/responses');
const VerificationDocument = require('../../models/VerificationDocument');
const upload = require('../../middleware/imageUploadMiddleware');


// upload Id
router.post('/id_card', authMiddleware, upload.fields([{ name: 'id_front' }, { name: 'id_back' }]), async (req, res) => {
    const userId = req.user.userId;
    const {id_type} = req.body;
    try {
      // Check if files were uploaded 
      if (!req.files || !req.files['id_front'] || !req.files['id_back']) { 
          return ResponseService.badRequest(res, 'Both front and back images or ID card are required'); 
      }

      if(id_type == null){
        return ResponseService.badRequest(res, 'Select ID type'); 
      }
  
      // Check if user data already exists to determine create or update operation
      const userData = await VerificationDocument.findOne({ user_id: userId });
  
      const updateData = {
        face_image: req.body.face_image || userData?.face_image,
        face_smile_image: req.body.face_smile_image || userData?.face_smile_image,
        id_front: req.files['id_front'] ? req.files['id_front'][0].path : userData?.id_front || null,
        id_back: req.files['id_back'] ? req.files['id_back'][0].path : userData?.id_back || null,
        id_type: id_type || userData?.id_type,
      };
  
      if (userData) {
        // Update existing user data
        await VerificationDocument.updateOne({ user_id: userId }, updateData);
        return ResponseService.success(res, updateData, 'Data updated successfully');
      } else {
        // Create new user data
        const newUserData = new VerificationDocument({ user_id: userId, ...updateData });
        await newUserData.save();
        return ResponseService.success(res, newUserData, 'Data created successfully');
      }
    } catch (error) {
      console.log('Error creating/updating data:', error);
      return ResponseService.error(res, 'Internal server error');
    }
  });

      // Get document by user 
      router.get('/', authMiddleware, async (req, res) => {
        const userId = req.user.userId;
        try {
          const docs = await VerificationDocument.findOne({user_id: userId})
          //if(!docs) return ResponseService.badRequest(res, "No document found");
                return ResponseService.success(res, {docs}, 'Documents fetched successfully');
        } catch (error) {
          return ResponseService.error(res, 'Error fetching documents');
        }
      });

      // Get all documents
      router.get('admin/', adminAuthMiddleware, async (req, res) => {
        const { page = 1, limit = 20 } = req.query;  
        try {
          const docs = await VerificationDocument.find()
            .sort({ createdAt: -1 })
.skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('user_id'); 
      
          const totalVerificationDocument = await VerificationDocument.countDocuments();
          const totalPages = Math.ceil(totalVerificationDocument / limit);
      
          return ResponseService.success(res, {
            docs,
            currentPage: parseInt(page),
            totalPages,
            totalVerificationDocument,
          }, 'Documents fetched successfully');
        } catch (error) {
          return ResponseService.error(res, 'Error fetching documents');
        }
      });
        
    // Get all documents by user Id
router.get('/admin/:userId', adminAuthMiddleware, async (req, res) => {
    const userId = req.params.userId;
    const { page = 1, limit = 20 } = req.query;  
    try {
      const docs = await VerificationDocument.find({user_id: userId})
        .sort({ createdAt: -1 })
.skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('user_id'); 
  
      const totalVerificationDocument = await VerificationDocument.countDocuments({user_id: userId});
      const totalPages = Math.ceil(totalVerificationDocument / limit);
  
      return ResponseService.success(res, {
        docs,
        currentPage: parseInt(page),
        totalPages,
        totalVerificationDocument,
      }, 'Documents fetched successfully');
    } catch (error) {
      return ResponseService.error(res, 'Error fetching documents');
    }
  });

module.exports = router;