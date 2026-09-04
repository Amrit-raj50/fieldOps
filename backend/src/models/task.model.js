const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Task title required."],
            trim: true,
            maxLength: [120, "title cannot exceed 120 characters."]
        },
        description: {
            type: String,
            trim: true,
            default: '',
            maxLength: [2000, "description cannot exceeds 2000 characters."]
        },
        employee: {
            type: String,
            // required: [true, "Employee is required"],
            trim: true,
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            // required: [true, "priority is required."],
            default: 'Medium',
        },
        location: {
            type: String,
            required: [true, "Location is srequired."],
            trim: true
        },
        dueDate: {
            type: Date,
            required: [true, 'Due date is required.'],
            // validate : {
            //     validator:function (value){
            //         return value >= new Date().setHours(0,0,0,0);
            //     },
            // message : "due date cannot be in the past",
            // },
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed", "Cancled", "Rejected"],
            default: "Pending",
        },
        empId: {
            type: String,
            default: null
        },
        evidence: {
            type: String,
            default: null
        },
        rejectReason: {
            type: String,
            default: null
        },
        cancelReason: {
            type: String,
            default: null
        },
        accept: {
            type: Boolean,
            default: false   // employee accepting the task
        },
        adminAccept: {
            type: Boolean,
            default: false   // admin accepting/approving a client complaint
        },
        start:{
            type : Boolean,
            default : false
        }
    },
    {
        timestamps: true,
    }
);

const task = mongoose.model('Task', taskSchema);
module.exports = task;