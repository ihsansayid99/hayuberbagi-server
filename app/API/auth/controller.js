const jwt = require('jsonwebtoken')
const User = require('../../users/model')
const config = require('../../../config')
const { OAuth2Client } = require('google-auth-library')

const client = new OAuth2Client("946995429747-4hk90v029dg6f54lovoo0vtftp66qrkt.apps.googleusercontent.com")

module.exports = {
    signup: async(req,res, next) => {
        try {
            const payload = req.body;
            let users = new User(payload)
            await users.save()
            delete users._doc.password
            res.status(201).json({
                data: payload,
                message: 'Berhasil Daftar'
            })

        } catch (err) {
            if(err && err.name === "ValidationError"){
                return res.status(422).json({
                    error: 1,   
                    message: err.message,
                    fields: err.errors
                })
            }
            next(err)
        }
    },
    actionGoogleSignin: async(req,res) => {
        const { tokenId } = req.body;
        client.verifyIdToken({idToken: tokenId, audience: "946995429747-4hk90v029dg6f54lovoo0vtftp66qrkt.apps.googleusercontent.com"})
            .then(response => {
                const {email_verified, name, email} = response.payload;
                if(email_verified){
                    User.findOne({email}).exec((err,user) => {
                        if(err){
                            return res.status(400).json({
                                message: "Something went wrong..."
                            })
                        }else{
                            if(user){
                                const token = jwt.sign({_id: user._id}, config.secretJwt, {expiresIn: '1d'})
                                const {_id,name,email} = user;
                                res.json({
                                    token,
                                    data: {_id, name, email}
                                })
                            }else{
                                let password = email+config.secretJwt;
                                let newUser =  User({email, name, status: 'Y', password, phoneNumber: '0'});
                                newUser.save((err, data) => {
                                    if(err){
                                        return res.status(400).json({
                                            message: "Something went wrong..."
                                        })
                                    }
                                    const token = jwt.sign({_id: data._id}, config.secretJwt, {expiresIn: '1d'})
                                    const {_id,name,email} = newUser;
                                    res.json({
                                        token,
                                        data: {_id, name, email}
                                    })
                                })
                            }
                        }
                    })
                }
            })
    }
}