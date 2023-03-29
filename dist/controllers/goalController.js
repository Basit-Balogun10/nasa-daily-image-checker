"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const asyncHandler = require('express-async-handler');
const Goal = require('../models/goalModel');
const User = require('../models/userModel');
// @desc    Get goals
// @route   GET /api/goals
// @access  Private
const getGoals = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const goals = yield Goal.find({ user: req.user.id });
    res.status(200).json(goals);
}));
// @desc    Set goal
// @route   POST /api/goals
// @access  Private
const setGoal = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.text) {
        res.status(400);
        throw new Error('Please add a text field');
    }
    const goal = yield Goal.create({
        text: req.body.text,
        user: req.user.id,
    });
    res.status(200).json(goal);
}));
// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const goal = yield Goal.findById(req.params.id);
    if (!goal) {
        res.status(400);
        throw new Error('Goal not found');
    }
    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }
    // Make sure the logged in user matches the goal user
    if (goal.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }
    const updatedGoal = yield Goal.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.status(200).json(updatedGoal);
}));
// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const goal = yield Goal.findById(req.params.id);
    if (!goal) {
        res.status(400);
        throw new Error('Goal not found');
    }
    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }
    // Make sure the logged in user matches the goal user
    if (goal.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }
    yield goal.remove();
    res.status(200).json({ id: req.params.id });
}));
module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal,
};
