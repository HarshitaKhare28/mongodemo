const express = require('express');
const router = express.Router();
const User = require('../../dblayer/user');
const { Error } = require('mongoose');
const GenerateResponse = require('../../utils/response_creator');

// HTTP get method to get list of users, this function would get invoked at /users/ API call 
router.get('/', async (req, res) => {
    const users = await getUsers();
    res.json(new GenerateResponse(true, undefined, users));
});

// HTTP post method to add a new user, this function would get invoked at /users/ API call
router.post('/', async (req, res) => {
    const userObj = req.body;

    try {
        const usr = await User.create(req.body);
        // Return all users as response
        const users = await getUsers();
        res.json(new GenerateResponse(true, undefined, users));
    } catch (error) {
        if (error instanceof Error) {
            res.json(new GenerateResponse(false, error.message));
        } else {
            res.json(new GenerateResponse(false, error));
        }
    }
});

// HTTP put method to update an existing user, this function would get invoked at /users/ API call
router.put('/', async (req, res) => {
    const userObj = req.body;
    try {
        const upResult = await User.findOneAndUpdate({ _id: userObj._id }, { age: userObj.age }, { returnDocument: 'after' });
        // Return all users as response
        const users = await getUsers();
        res.send(new GenerateResponse(true,undefined,users));
    } catch (error) {
        if (error instanceof Error) {
            res.json(new GenerateResponse(false, error.message));
        } else {
            res.json(new GenerateResponse(false, error));
        }
    }
});

// HTTP delete method to delete an existing user, this function would get invoked at /users/ API call
router.delete('/:id', async (req, res) => {
    try {
        const delResult = await User.deleteOne({ _id: req.params.id });
        if(delResult.hasOwnProperty("deletedCount") && delResult.deletedCount === 1){
            // Return remaining users as response
            const users = await getUsers();
            res.json(new GenerateResponse(true, undefined, users));   
        } else {
            res.json(new GenerateResponse(false, "Unable to delete user at the moment."));
        }
    } catch (error) {
        if (error instanceof Error) {
            res.json(new GenerateResponse(false, error.message));
        } else {
            res.json(new GenerateResponse(false, error));
        }
    }
});

async function getUsers(){
    const users = await User.find({}).lean();
    return users instanceof Array ? users : [];
}

module.exports = router;