const chatModel = require('../models/chatModel')

const createChat = async(req,res)=>{
    const {firstId, secondId} = req.body

    try {
        const chat = await chatModel.findOne()
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}