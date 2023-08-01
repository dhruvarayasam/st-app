const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        min:4,
        unique:true
    }, 

    password: {
        type: String,
        required: true
    },

    APCA_auth_status: {
        type:Boolean,
        default: false
    }, 

    APCA_API_KEY: {
        type:String,
        default: ''
    },

    APCA_SECRET_KEY: {
        type:String,
        default: ''
    },

    APCA_WATCHLIST: {
        type: [String],
        default: [],
        unique:true
    }, 

    APCA_FAVS: {
        type: [String],
        default: []
    }
});

const UserModel = model('User', UserSchema)

module.exports = UserModel;