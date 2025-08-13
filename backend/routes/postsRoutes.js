const express = require('express');
const router = express.Router();
const {verifyJsonTokenUser}=require('../middleware/VerifyJsonToken.js')
const {getPost, likePost, commentPost, deleteComment, createPost}=require('../controllers/postsController.js')


router.get('/all',verifyJsonTokenUser,getPost)
router.post('/create',verifyJsonTokenUser,createPost)
router.post('/like',verifyJsonTokenUser,likePost)
router.post('/comment',verifyJsonTokenUser,commentPost)
router.delete('/comment', verifyJsonTokenUser, deleteComment)



module.exports = router;
