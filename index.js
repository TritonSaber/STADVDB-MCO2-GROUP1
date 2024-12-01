const express = require('express');
const app = express();
const PORT = 3000;

app.get("/", (req,res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/dev', async (req, res) => {
    try {
        const users = await developer.findAll();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
    }
});

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});