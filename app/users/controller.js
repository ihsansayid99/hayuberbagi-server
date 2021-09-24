const User = require('./model')
const bcrypt = require('bcryptjs')

module.exports = {
    viewSignin: async(req,res) => {
        try{
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };
            if(req.session.user === null || req.session.user === undefined){
                res.render('admin/users/view_signin', {
                    alert
                });
            }else{
                res.redirect('/dashboard');
            }
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/');
        }
    },
    actionSignin: async(req,res) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email: email })
            console.log("user >")
            console.log(user)
            if(user){
                if(user.status == 'Y'){
                    const checkPassword = await bcrypt.compare(password, user.password)
                    if(checkPassword){
                        req.session.user = {
                            id: user._id,
                            email: user.email,
                            status: user.status,
                            name: user.name
                        }
                        res.redirect('/dashboard')
                    }else{
                        req.flash('alertMessage', 'Username / Password salah');
                        req.flash('alertStatus', 'danger');
                        res.redirect('/');
                    }
                }
            }else{
                req.flash('alertMessage', 'Akun anda belum aktif / terdaftar');
                req.flash('alertStatus', 'danger');
                res.redirect('/');
            }
        } catch (err) {
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/');
        }
    },
    actionLogout: async(req,res) => {
        req.session.destroy();
        res.redirect('/')
    },
    actionGoogleSignin: async(req,res) => {
        const payload = req.body;
        console.log(payload)
    }
}