
module.exports = (app) => {
    app.use('/api/user', require('./userRoute'));
    app.use('/api/product', require('./prodRoute'));
    app.use('/api/admin', require('./adminRoute'));
}
