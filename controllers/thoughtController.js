const { Thought, User } = require('../models');

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
            const thought = await Thought.findById(req.params.thoughtId).select('-__v')

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
    }

    
}