const mongoose = require("mongoose");
const Tags = require("../models/Tags");
const utils = require("../controllers/utils");
const Customers = require("../models/Customers");


exports.createTags = async (req, res) => {
    try {

        const tagNo = req.body.tagNo;
        const epcCode = req.body.epcCode;

        await Tags.create({
            tagNo: tagNo,
            epcCode: epcCode,
        })
        if (Tags) {
            utils.commonResponce(res, 200, "Tags created Sucessfully"),
                Tags

        }
    } catch (error) {
        utils.commonResponce(res, 500, "Unexpected Server Error", error.toString());

    }
}

exports.getAllTags = async (req, res) => {
    try {

        const data = await Tags.find()

        utils.commonResponce(res, 200, "Successfully fetched Tags", data);

    } catch (error) {
        console.log("error", error);
    }
};

exports.getAvailableTags = async (req, res) => {
    try {
        let tag_data = []
        let all_tags = await Tags.find()
        let all_customers = await Customers.find()

        let available_tags = [];

        all_tags.map((tag) => {
            let shouldAddTag = true; // Flag to track if we should add the tag

            all_customers.map((customer) => {
                // console.log(tag.tagNo, customer.tagNo);
                // If any customer has the same tagNo, set the flag to false
                if (tag.tagNo === customer.tagNo) {
                    shouldAddTag = false;
                }
            });

            // Only add the tag if the flag is still true
            if (shouldAddTag && !available_tags.includes(tag.tagNo)) {
                available_tags.push(tag.tagNo);
            }
        });

        // console.log(available_tags);

        for (const tagNo of available_tags) {
            temp_storage = await Tags.find({ tagNo })
            tag_data.push(temp_storage[0])
        }

        // console.log(tag_data); // This will log the data for each tagNo, one by one

        utils.commonResponce(res, 200, "Successfully fetched Customers", tag_data);

    } catch (error) {
        console.log("error", error);
    }
};

exports.updateTags = async (req, res) => {
    try {
        const tagNo = req.body.tagNo;
        const epcCode = req.body.epcCode;
        const _id = req.body._id

        await Tags.findByIdAndUpdate(_id, {
            tagNo: tagNo,
            epcCode: epcCode,
            _id: _id,

        }).then(async (tagsdata) => {
            const tags = await Tags.find();
            utils.commonResponce(res, 200, "Tags updated Successfully", tags);
        });
    } catch (error) {
        console.log('error: ', error);
        utils.commonResponce(res, 500, "Server Error", error);
    }
}

exports.deleteTags = async (req, res) => {
    try {

        const _id = req.body._id;

        await Tags.findByIdAndDelete({
            _id: _id,
        }).then(async (tagsdata) => {
            const tags = await Tags.find();
            utils.commonResponce(res, 200, "tags deleted Successfully", tags);
        })
    } catch (error) {
        console.log('error: ', error);
        utils.commonResponce(res, 500, "Server Error", error);

    }
}