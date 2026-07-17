import mongoose, { Document } from "mongoose";

const Schema = mongoose.Schema;

interface ProfileDoc extends Document{
    name : string;
    user : string;
    gamertag : string;
    description : string;
    imageName : string;
    imageUrl : string;
}

const ProfileSchema = new Schema<ProfileDoc>({
    name: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    gamertag: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
}, { timestamps: false });

export default mongoose.model('Profile', ProfileSchema);