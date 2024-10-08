const { Thought, User } = require('../models');
const mongoose = require('mongoose');

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find().select('-__v');

            res.json(thoughts)
        } catch (error) {
            res.status(500).json(error);
        }
    },

    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findById(req.params.thoughtId)

            if (!thought) {
                return res.status(404).json(
                    {
                        message: 'No thought found.'
                    })
            
                }

            res.json(thought);
        } catch (error) {
            res.status(500).json(error)
        }
    },

    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);

            await User.findByIdAndUpdate(
                {$push: {thoughts: thought._id} },
                { new: true }
            );

            res.json(thought);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    async updateThought(req, res) {
        try {
            const thought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                req.body,
                { new: true, runValidators: true }
            );

            if (!thought) {
                return res.status(404).json({
                    message: 'No thought found.'
                });
            }

            res.json(thought);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    async deleteThought(req, res) {
        try {
            const thought = await Thought.findByIdAndDelete(req.params.thoughtId);

            if (!thought) {
                return res.status(404).json({
                    message: 'No thought found'
                });
            }

            await User.findByIdAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            );

            res.json({
                message: 'Thoought deleted.'
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    async addReaction(req, res) {
        try {
            const thought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                { $push: { reactions: req.body } },
                { new: true, runValidators: true }
            );

            if (!thought) {
                return res.status(404).json({
                    message: 'No thought found.'
                })
            }

            res.json(thought);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    async removeReaction(req, res) {
        try {
            const { thoughtId, reactionId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(reactionId)) {
                return res.status(400).json({ message: 'Invalid reaction ID format' });
              }
          
            const thought = await Thought.findByIdAndUpdate(
                thoughtId,
                {
                    $pull: {
                      reactions: { _id: reactionId },
                    }
                },
                { new: true },
            );

            if (!thought) {
                return res.status(404).json({
                    message: 'No thought found.'
                })
            }

            res.json({
                message: 'Reaction deleted.', 
                thought
            })
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    },
}