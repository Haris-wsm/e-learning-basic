require('dotenv').config();
const app = require('./app');
const port = process.env.PORT || 5500;

app.listen(port, () => console.log(`app is running on port ${port}`));
