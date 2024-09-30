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

    async createUser(req, res) {
        try {
            const user = await User.create(req.body);

            res.json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    async updateUser(req, res) {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!user) {
                return res.status(404).json(
                    {
                        message: 'No user with this ID.'
                    }
                )
            }

            res.json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    async deleteUser(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.userId);

            if (!user) {
                return res.status(404).json(
                    {
                        message: 'No user with this ID.'
                    }
                )
            }

            await Thought.deleteMany({
                username: user.username
            });

            res.json({
                message: 'User deleted.'
            })
        } catch (error) {
            res.status(500).json(error);
        }
    },

    async addFriend(req, res) {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                {
                    $addToSet: {
                        friends: req.params.friendId
                    }
                },
                { new: true }
            )
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
            res.status(500).json(error);
        }
    },

    async removeFriend(req, res) {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                { $pull: { friends: req.params.friendId } },
                { new: true }
            ).populate('friends');

            if (!user) {
                return res.status(404).json(
                    {
                        message: 'No user with this ID.'
                    }
                )
            }

            res.json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}