import express from 'express';
import { Liquid } from 'liquidjs';
import { readdir, readFile } from 'node:fs/promises';

const app = express();
const engine = new Liquid();

app.engine('liquid', engine.express());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 8000);
app.set('views', './views');

const files = await readdir('content');

app.get('/', async function (req, res) {
    res.render('index.liquid');
});

app.get('/digital-garden', async function (req, res) {
    res.render('garden.liquid');
})

app.get('/learning-journal', async function (req, res) {
    res.render('journal.liquid', { files: files });
})

app.get('/learning-journal/:slug', async function (req, res) {
    let file = req.params.slug;
    const fileContents = await readFile('content/' + file + '.md', { encoding: 'utf8' });
    res.render('article.liquid', { fileContents: fileContents });
})

app.listen(app.get('port'), function () {
    console.log(`Application started on http://localhost:${app.get('port')}`);
});