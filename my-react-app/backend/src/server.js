const app = require('./app'); // Import the configured app
const PORT = process.env.PORT || 5000;


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});