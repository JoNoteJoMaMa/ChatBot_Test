const app = require('./app'); // Import the configured app
const PORT = process.env.PORT || 5000;


// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
