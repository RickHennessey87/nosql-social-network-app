const router = require('express').Router();
const apiRoutes = require('./api');
// const thoughtRoutes = require('./thoughtRoutes');

router.use('/api', apiRoutes);
// router.use('/thoughts', thoughtRoutes);

router.use((req, res) => res.status(404).send('Not Found'));

module.exports = router;