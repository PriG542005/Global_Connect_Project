const Connection = require('../models/Connection');
const Profile = require('../models/Profile');

// Get current user's accepted connections
const getConnections = async (req,res) => {
    try{
        const userId = req.user.userId;
        const connections = await Connection.find({
            $or: [{ requester: userId, status: 'accepted' }, { recipient: userId, status: 'accepted' }]
        }).populate('requester recipient','name email avatar title');
        // Map to other user
        const mapped = connections.map(c=>{
            const other = (c.requester._id.equals(userId)) ? c.recipient : c.requester;
            return { id: c._id, user: other, status: c.status };
        });
        res.json(mapped);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

// Get incoming pending requests
const getPendingRequests = async (req,res) => {
    try{
        const userId = req.user.userId;
        const requests = await Connection.find({ recipient: userId, status: 'pending' }).populate('requester','name email avatar title');
        res.json(requests);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

// Send a connection request
const sendRequest = async (req,res) => {
    try{
        const requester = req.user.userId;
        const { recipientId } = req.body;
        if(!recipientId) return res.status(400).json({message:'recipientId required'});
        // prevent duplicates
        const exists = await Connection.findOne({
            $or: [
                { requester, recipient: recipientId },
                { requester: recipientId, recipient: requester }
            ]
        });
        if(exists){
            return res.status(400).json({message:'Connection or request already exists'});
        }
        const conn = new Connection({ requester, recipient: recipientId });
        await conn.save();
        res.status(201).json(conn);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

// Accept a request
const acceptRequest = async (req,res) => {
    try{
        const userId = req.user.userId;
        const id = req.params.id;
        const conn = await Connection.findById(id);
        if(!conn) return res.status(404).json({message:'Not found'});
        if(!conn.recipient.equals(userId)) return res.status(403).json({message:'Not authorized'});
        conn.status = 'accepted';
        await conn.save();
        res.json(conn);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

// Remove connection or cancel request
const removeConnection = async (req,res) => {
    try{
        const userId = req.user.userId;
        const id = req.params.id;
        const conn = await Connection.findById(id);
        if(!conn) return res.status(404).json({message:'Not found'});
        // allow either side to delete
        if(!conn.recipient.equals(userId) && !conn.requester.equals(userId)) return res.status(403).json({message:'Not authorized'});
        await conn.remove();
        res.json({message:'removed'});
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

module.exports = { getConnections, getPendingRequests, sendRequest, acceptRequest, removeConnection };
