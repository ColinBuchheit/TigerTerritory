const mongoose = require('mongoose');
const uri = "mongodb+srv://User1:Password@cluster0.o7m7qbv.mongodb.net/sports_website?retryWrites=true&w=majority&authSource=admin";

console.log('Attempting to connect to MongoDB...');

mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB Connected Successfully!');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
  });