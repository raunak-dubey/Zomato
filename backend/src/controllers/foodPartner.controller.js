const foodPartnerModel = require("../models/foodpartner.model");
const foodModel = require("../models/food.model");

async function getFoodPartner(req, res) {
    const foodPartnerId = req.params.id;

    const foodPartner = await foodPartnerModel.findById(foodPartnerId)
    const foodItems = await foodModel.find({ foodPartner: foodPartnerId });
    if(!foodPartner) {
        return res.status(404).json({ message: "Food Partner not found" });
    }
    res.status(200).json({ 
        message: "Food Partner retrieved successfully",
        foodPartner: {
            ...foodPartner.toObject(),
            foodItems,
        }
    });
}

module.exports = {
    getFoodPartner,
};