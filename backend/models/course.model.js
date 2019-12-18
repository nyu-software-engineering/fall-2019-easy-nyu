const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({ 
    name: {type: String, required: true},
    major: {type: String},
    school: {type: String},
    number: {type: String},
    level: {type: String},
    unit: {type: String},
    description: {type: String, required: true},
    requirement: {type: String},
    note: {type: String},
    profs: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Professor' }],
    comments: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    materials: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Material' }]
}, {
    timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;