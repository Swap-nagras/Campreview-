const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelper');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (arr) => {
    //return a random element from the array
    return arr[Math.floor(Math.random() * arr.length)];
}

const deleteCampgrounds = async () => {
    await Campground.deleteMany({});
    console.log('deleted all campgrounds');
}
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 100; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 2000) + 500;
        const newCampground = new Campground({
            author: '648c562d5a0700714a0406d7',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dak2vviji/image/upload/v1688400711/Campreview%2B/li7gjwa6vwpzl0e4bumk.jpg',
                    filename: 'Campreview+/li7gjwa6vwpzl0e4bumk',
                },
                {
                    url: 'https://res.cloudinary.com/dak2vviji/image/upload/v1688400712/Campreview%2B/jdqqlajy3k4lbi0ahswy.jpg',
                    filename: 'Campreview+/jdqqlajy3k4lbi0ahswy',
                }
            ],
            price: price,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        });
        await newCampground.save();
    }
}
deleteCampgrounds();
seedDB();