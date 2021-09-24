const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

let userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email Harus Diisi']
    },
    name: {
        type: String,
        required: [true, 'Nama Harus Diisi']
    },
    status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    },
    password: {
        type: String,
        required: [true, 'Password Harus Diisi']
    },
    role: {
        type: String,
        enum: ['admin-hb', 'admin-panti', 'user'],
        default: 'user'
    },
    phoneNumber: {
        type: String,
        required: [true, 'No HP Harus Diisi']
    },
}, {timestamps: true})

userSchema.path('email').validate(async function(value){
    try {
        const count = await this.model('User').countDocuments({email : value});
        return !count;
    } catch (err) {
        throw err
    }
}, attr => `${attr.value} Sudah terdaftar`)

userSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, 8);
    next();
})

module.exports = mongoose.model('User', userSchema);