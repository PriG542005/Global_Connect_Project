const express = require('express');
const router = express.Router();
const { verifyJsonTokenUser } = require('../middleware/VerifyJsonToken');
const { getConnections, getPendingRequests, sendRequest, acceptRequest, removeConnection } = require('../controllers/connectionsController');

router.get('/', verifyJsonTokenUser, getConnections);
router.get('/requests', verifyJsonTokenUser, getPendingRequests);
router.post('/', verifyJsonTokenUser, sendRequest);
router.patch('/:id/accept', verifyJsonTokenUser, acceptRequest);
router.delete('/:id', verifyJsonTokenUser, removeConnection);

module.exports = router;
