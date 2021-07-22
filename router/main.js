const router = (app) => {
    app.get('/', (req, res) => {
        res.render('../views/index.html');
    })
    
    app.get('/about', (req, res) => {
        res.render('../views/about.html');
    })
}

export default router;