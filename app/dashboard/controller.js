module.exports ={
    index: async(req,res) => {
        try{
            res.render('index',{
                name: req.session.user.name,
                title: 'Halaman Dashboard | Admin HayuBerbagi'
            });
        }catch(err){
            console.log(err)
        }
    }
}