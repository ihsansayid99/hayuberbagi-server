const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug)

let newsSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Judul Berita Harus Diisi']
    },
    slug: {
        type:String,
        slug: "title"
    },
    descNews: {
        type: String,
        required: [true, 'Isi Berita Harus Diisi']
    },
    thumbnail: {
        type: String,
        required: [true, 'Thumbnail Harus ada!']
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

module.exports = mongoose.model('News', newsSchema);