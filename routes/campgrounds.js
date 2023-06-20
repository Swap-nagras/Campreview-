const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema, reviewSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        //important to call next since this is middleware
        next();
    }
}
router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('./campgrounds/index', { campgrounds });
})
router.get('/new', isLoggedIn, (req, res) => {
    res.render('./campgrounds/new');
})
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {

    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    req.flash('success', 'Campground created successfully!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('./campgrounds/show', { campground });
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('./campgrounds/edit', { campground });
}))
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Campground updated successfully');
    res.redirect(`/campgrounds/${campground._id}`);
}))
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the Campground!');
    res.redirect('/campgrounds');
}))

module.exports = router;