const News = require('./model');
const path = require('path')
const fs = require('fs')
const config = require('../../config')
const slugify = require('slugify')

module.exports ={
    index: async(req,res) => {
        try{
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };
            const news = await News.find();
            res.render('admin/news/view_news', {
                news,
                alert,
                title: 'Halaman Berita | Admin HayuBerbagi',
                name: req.session.user.name,
            });
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/news');
        }
    },
    viewCreate: async(req, res) => {
        try {
            res.render('admin/news/create',{
                title: 'Halaman Buat Berita | Admin HayuBerbagi',
                name: req.session.user.name,
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/news');
        }
    },
    actionCreate: async(req,res) => {
        try {
            const {title, descBerita} = req.body;
            if(req.file){
                let tmp_path = req.file.path;
                let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let fileName = req.file.originalname.split('.')[0] + '.' + originalExt
                let target_path = path.resolve(config.rootPath, `public/uploads/news/${fileName}`)

                const src = fs.createReadStream(tmp_path)
                const dest = fs.createWriteStream(target_path)

                src.pipe(dest)
                src.on('end', async()=> {
                    try {
                        const news = News({
                            title,
                            descNews: descBerita,
                            thumbnail: fileName,
                        })
                        await news.save();
                        req.flash('alertMessage', 'Berhasil Tambah Berita');
                        req.flash('alertStatus', 'success');
                        res.redirect('/news');
                    } catch (error) {
                        req.flash('alertMessage', `${error.message}`);
                        req.flash('alertStatus', 'danger');
                        res.redirect('/news');
                    }
                })
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/news');
        }
    },
    viewEdit: async(req,res) => {
        try {
            const {id} = req.params;
            const news =  await News.findOne({_id: id});
            res.render('admin/news/edit', {
                news,
                title: 'Halaman Berita | Admin HayuBerbagi',
                name: req.session.user.name,
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/news');
        }
    },
    actionEdit: async(req,res)=> {
        try {
            const { id } = req.params;
            const {title, descBerita, tmp_image} = req.body;
            const slug = slugify(title, {
                replacement: '-',
                lower: true
            })
            if(req.file){
                let tmp_path = req.file.path;
                let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let fileName = req.file.originalname.split('.')[0] + '.' + originalExt
                let target_path = path.resolve(config.rootPath, `public/uploads/news/${fileName}`)

                const src = fs.createReadStream(tmp_path)
                const dest = fs.createWriteStream(target_path)

                src.pipe(dest)
                if(fileName !== tmp_image){
                    fs.unlink(`public/uploads/news/${tmp_image}`, (err) => {
                        if (err) throw err;
                        console.log('image terhapus');
                    })
                }
                src.on('end', async() => {
                    try {
                        await News.findOneAndUpdate({
                            _id: id,
                        }, {title, descNews:descBerita, thumbnail: fileName, slug });
                        req.flash('alertMessage', 'Berhasil Ubah Berita');
                        req.flash('alertStatus', 'success');
                        res.redirect('/news');
                    } catch (error) {
                        req.flash('alertMessage', `${error.message}`);
                        req.flash('alertStatus', 'danger');
                        res.redirect('/news');
                    }
                })
            }else{
                await News.findOneAndUpdate({
                    _id: id,
                }, {title, descNews:descBerita, thumbnail: tmp_image, slug  });
                req.flash('alertMessage', 'Berhasil Ubah Berita');
                req.flash('alertStatus', 'success');
                res.redirect('/news');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/news');
        }
    },
    actionDelete: async(req,res) => {
        try {
            const { id } = req.params;
            const news = await News.findOne({_id: id});
            fs.unlink(`public/uploads/news/${news.thumbnail}`, (err) => {
                if (err) throw err;
                console.log('image terhapus');
            })
            await News.findOneAndRemove({
                _id: id,
            });
            req.flash('alertMessage', 'Berhasil Delete Berita');
            req.flash('alertStatus', 'success');
            res.redirect('/news');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/news');
        }
    }
}