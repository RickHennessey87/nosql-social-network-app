const { User, Thought } = require('../models');

module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find()
                .select('-__v')
                .populate('thoughts')
                .populate('friends');
            
            res.json(users);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    async getSingleUser(req, res) {
        try {
            const user = await User.findById(req.params.userId)
                .select('-__v')
                .populate('thoughts')
                .populate('friends');

            if (!user) {
                return res.status(404).json(
                    {
                        message: 'No user with this ID.'
                    }
                )
            }

            res.json(user);
        } catch (error) {
            res.status(500).json(error)
        }
    },

    
}