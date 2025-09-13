const foodModel = require('../models/food.model');
const saveModel = require('../models/save.model');
const likeModel = require('../models/likes.model');
const storageService = require('../services/storage.service');
const { v4: uuid } = require('uuid');


async function createFood(req, res) {
    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!videoFile) {
        return res.status(400).json({
            message: "No video file uploaded."
        });
    }
    if (!thumbnailFile) {
        return res.status(400).json({
            message: "No thumbnail file uploaded."
        });
    }

    const videoUploadResult = await storageService.uploadFile(videoFile.buffer, uuid());
    const thumbnailUploadResult = await storageService.uploadFile(thumbnailFile.buffer, uuid());

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: videoUploadResult.url,
        thumbnail: thumbnailUploadResult.url,
        foodPartner: req.foodPartner._id
    });

    res.status(201).json({
        message: "food created successfully",
        food: foodItem
    });
}

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find();

    res.status(200).json({
        message: "food items fetched successfully",
        foodItems
    });
} 

async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const isLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    });

    if (isLiked) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId,
        });

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        });

        return res.status(200).json({
            message: "food unliked successfully"
        });
    }

    const like = await likeModel.create({
        user: user._id,
        food: foodId
    });

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    });

    res.status(201).json({
        message: "food liked successfully",
        like
    });
}

async function saveFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const isSaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    });

    if (isSaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId,
        });

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: -1 }
        });

        return res.status(200).json({
            message: "food unsaved successfully"
        });
    }
    const save = await saveModel.create({
        user: user._id,
        food: foodId
    });

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: 1 }
    });

    res.status(201).json({
        message: "food saved successfully",
        save
    });
}

async function getSaveFood(req, res) {
    const user = req.user;
    const savedFoods = await saveModel.find({ user: user._id }).populate('food');
    
    if (!savedFoods) {
        return res.status(404).json({
            message: "No saved food items found"
        });
    }
    res.status(200).json({
        message: "Saved food items fetched successfully",
        savedFoods
    });
}

module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood
};