const mongoose = require('mongoose');
const { User, Thought } = require('./models');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialNetworkDB')

const users = [
    {
        username: 'rick',
        email: 'rick@gmail.com'
    },
    {
        username: 'jacob',
        email: 'jacob@gmail.com'
    },
    {
        username: 'peter',
        email: 'peter@gmail.com'
    },
];

const thoughts = [
    {
        thoughtText: 'I thought I had.',
        username: 'rick'
    },
    {
        thoughtText: 'thoughts, thoughts, thoughts',
        username: 'jacob'
    },
    {
        thoughtText: 'reptilian space wizards',
        username: 'peter'
    },

];

const seedDatabase = async () => {
    try {
        await User.deleteMany({});
        await Thought.deleteMany({});

        console.log('Data cleared.')

        const createdUsers = await User.insertMany(users);

        console.log('users created.')

        const userMap = {};

        createdUsers.forEach((user) => {
            userMap[user.username] = user._id;
        });

        for (const thoughtData of thoughts) {
            const { thoughtText, username } = thoughtData;

            const newThought = await Thought.create({
                thoughtText,
                username
            });

            await User.findOneAndUpdate(
                { username },
                { $push: { 
                    thoughts: newThought._id 
                    } 
                },
                { new: true }
            );

            console.log('Thought added.')
        }

        await User.findOneAndUpdate(
            { username: 'rick' },
            { $addToSet: 
                {
                    friends: userMap['jacob']
                }
            }
        );

        await User.findOneAndUpdate(
            { username: 'jacob' },
            { $addToSet: 
                {
                    friends: userMap['rick']
                }
            }
        );

        console.log('friendships created.')
        console.log('Seeding is complete.')
    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();