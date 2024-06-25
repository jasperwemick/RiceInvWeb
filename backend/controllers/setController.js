const Set = require('../models/setModel')

const getBracketSets = async (req, res) => {
    const tag = req.params.tag

    try {
        const sets = await Set.find({gameTag: tag}).populate('upperSeed').populate('lowerSeed').exec()
        res.json(sets)
    }
    catch(e) {
        console.log('Error at GET /set/:tag', e)
    }
}

const getOneBracketSet = async (req, res) => {

    const num = req.params.num
    const tag = req.params.tag

    try {
        const set = await Set.findOne({gameTag: tag, setID: num}).populate('upperSeed').populate('lowerSeed').exec()
        res.json(set)
    }
    catch(e) {
        console.log('Error at GET /set/:tag/:num', e)
    }
}

const createOneBracketSet = async (req, res) => {
    try {
        const post = await Set.create({
            ...req.body
        })
        const result = await post.save()

        res.json(result)
    }
    catch(e) {
        console.log('Error at POST /set', e)
    }
}

const upsertOneBracketSet = async (req, res) => {
    const num = req.params.num
    const tag = req.params.tag

    const options = {upsert: true, new: true, setDefaultsOnInsert: true};

    try {
        const result = await Set.findOneAndUpdate({gameTag: tag, setID: num}, {...req.body}, options)
        res.json(result)
    }
    catch(e) {
        console.log('Error at PUT /set/:tag/:num', e)
    }
}

const deleteOneBracketSet = async (req, res) => {
    const num = req.params.num
    const tag = req.params.tag


    try {
        const result = await Set.findOneAndDelete({gameTag: tag, setID: num})
        res.json(result)
    }
    catch(e) {
        console.log('Error at DELETE /set/:tag/:num', e)
    }
}

module.exports = { getBracketSets, getOneBracketSet, createOneBracketSet, upsertOneBracketSet, deleteOneBracketSet }