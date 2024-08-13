const Set = require('../models/setModel')

const getBracketSets = async (req, res) => {
    const tag = req.params.tag

    try {
        const sets = await Set.find({gameTag: tag}).populate('upperSeedProfiles').populate('lowerSeedProfiles').exec()
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
        const set = await Set.findOne({gameTag: tag, setID: num}).populate('upperSeedProfiles').populate('lowerSeedProfiles').exec()
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
        const result = await Set.findOneAndUpdate(
            {gameTag: tag, setID: num}, 
            {...req.body, upperSeedProfiles: req.body.upperSeedIDs, lowerSeedProfiles: req.body.lowerSeedIDs}, 
            options
        )
        res.json(result)
    }
    catch(e) {
        console.log('Error at PUT /set/:tag/:num', e)
    }
}

const upsertManyBracketSets = async (req, res) => {
    const tag = req.params.tag

    const options = {upsert: true, new: true, setDefaultsOnInsert: true};
    console.log(req.body)
    try {
        req.body.forEach( async (set) => {
            try {
                if (set) {
                    await Set.findOne({gameTag: tag, setID: set.setID}).then(
                        async (doc) => {
                            try {
                                if (doc) {
                                    await Set.findOneAndUpdate(
                                        {gameTag: tag, setID: set.setID}, 
                                        {
                                            ...set, 
                                            upperSeedProfiles: (doc.upperSeedProfiles.length === 0 ? set.upperSeedIDs : doc.upperSeedProfiles), 
                                            lowerSeedProfiles: (doc.lowerSeedProfiles.length === 0 ? set.lowerSeedIDs : doc.lowerSeedProfiles)
                                        }, 
                                        options
                                    )
                                }
                                else {
                                    await Set.findOneAndUpdate(
                                        {gameTag: tag, setID: set.setID}, 
                                        {
                                            ...set, 
                                            upperSeedProfiles: set.upperSeedIDs, 
                                            lowerSeedProfiles: set.lowerSeedIDs
                                        }, 
                                        options
                                    )
                                }
    
                            }
                            catch(e) {
                                console.log('Error at Put, upsertManyBracketSets', e)
                            }
                        }
                    )
                }
            }
            catch(e) {
                console.log('Error at Put, upsertManyBracketSets', e)
            }
        });

        res.json()
    }
    catch(e) {
        console.log('Error at PUT /set/:tag/', e)
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

module.exports = { getBracketSets, getOneBracketSet, createOneBracketSet, upsertOneBracketSet, upsertManyBracketSets, deleteOneBracketSet }