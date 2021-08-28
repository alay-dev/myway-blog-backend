const express  = require('express') ;
const commentController = require('../controllers/commentController') ;

const router = express.Router() ;

router
    .route('/')
    .get(commentController.getAllComment)
    .post(commentController.createComment)
    // .patch(commentController.updateComment)
    .delete(commentController.deleteComment) ;

module.exports = router ;