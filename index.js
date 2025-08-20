const express = require('express');
const mongoose = require('mongoose');
const server = express();

server.use(express.json());
const connectDb = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/halat');
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
};


const waitListSchema = new mongoose.Schema({
    phoneNumber: Number,
    email: String,
    firstName: String,
    lastName: String,
    whatBusinessAreYouInto: String,
}, { timestamps: true,
    versionKey: false
 });

 const WaitList = mongoose.model('WaitList', waitListSchema);
server.post('/waitList', async (req, res) => {
    const { phoneNumber, email, firstName, lastName, whatBusinessAreYouInto } = req.body;
    if (!phoneNumber || !email || !firstName || !lastName || !whatBusinessAreYouInto) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const newWaitList = new WaitList({
            phoneNumber,
            email,
            firstName,
            lastName,
            whatBusinessAreYouInto
        });
        await newWaitList.save();
        res.status(201).json({ message: 'Waitlist entry created successfully' });
    } catch (error) {
        console.error('Error creating waitlist entry:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

server.get('/listOfThoseOnWaitList', async (req, res) => {
    try {
        const waitList = await WaitList.find();
        res.status(200).json(waitList);
    } catch (error) {
        console.error('Error fetching waitlist entries:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

server.get('/numberOfThoseOnWaitList', async (req, res) => {
    try {
        const numberOfPeopleOnWaitList = await WaitList.countDocuments();
        res.status(200).json({ numberOfPeopleOnWaitList });
    } catch (error) {
        console.error('Error counting waitlist entries:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





server.listen(8900, () => {
    connectDb()
    console.log('Server is running on port 8900');
    
})