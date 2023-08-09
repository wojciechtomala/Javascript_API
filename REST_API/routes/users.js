const express = require('express');
// GET THE ROUTER FOR EXPRESS:
const router = express.Router();
// IMPORT USER DB SCHEMA:
const User = require('../models/user');


// ROUTES:

// GETTING ALL USERS:
router.get('/', async (req,res) => {
    try {
        // FIND ALL SUBSCRIBERS
        const users = await User.find();
        res.json(users);
    } catch(error) {
        res.status(500).json({ message: err.message });
    }
});
// GETTING ONE USER (/:id PARAMETER):
router.get('/:id', getUser, (req,res) => {
    res.json(res.user);
});
// CREATING ONE USER:
router.post('/', async (req,res) => {
    const user = new User({
        name: req.body.name,
        nationality: req.body.nationality,
    });
    try{
        const newUser = await user.save();
        res.status(201).json(newUser);
    }catch(err){
        res.status(400).json({ message: err.message });
    }
});
// UPDATING USER:
router.patch('/:id', getUser, async (req,res) => {
    if(req.body.name != null){
        res.user.name = req.body.name;
    }
    if(req.body.nationality != null){
        res.user.nationality = req.body.nationality;
    }
    try{
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    }catch(err){
        res.status(400).json({ message: err.message });
    }
});
// DELETING USER:
router.delete('/:id', getUser, async (req,res) => {
    try{
        await res.user.deleteOne();
        res.json({ message: 'User deleted' });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
});

// MIDDLEWARE:
async function getUser(req,res,next){
    let user;
    try{
        user = await User.findById(req.params.id);
        if(user == null){
            return res.status(404).json({ message: 'Cannot find user'});
        }
    }catch(err){
        return res.status(500).json({ message: err.message });
    }
    res.user = user;
    next();
}



module.exports = router;