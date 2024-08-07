const express = require('express');
const app = express();
const data = require('./data.json'); // Load your data from a JSON file

// Get all unique codes
app.get('/codes', (req, res) => {
    const codes = [...new Set(data.map(item => item.code))];
    res.json(codes);
});

// Get all sections for a code
app.get('/sections', (req, res) => {
    const { code } = req.query;
    const sections = data.filter(item => item.code === code).map(item => item.section);
    res.json(sections);
});

// Get all books for a code
app.get('/books', (req, res) => {
    const { code } = req.query;
    const books = [...new Set(data.filter(item => item.code === code).map(item => item.book))];
    res.json(books);
});

// Get all titles for a code and book
app.get('/titles', (req, res) => {
    const { code, book } = req.query;
    const titles = [...new Set(data.filter(item => item.code === code && item.book === book).map(item => item.title))];
    res.json(titles);
});

// Get all chapters for a code, book, and title
app.get('/chapters', (req, res) => {
    const { code, book, title } = req.query;
    const chapters = [...new Set(data.filter(item => item.code === code && item.book === book && item.title === title).map(item => item.chapter))];
    res.json(chapters);
});

// Get all parts for a code, book, title, and chapter
app.get('/parts', (req, res) => {
    const { code, book, title, chapter } = req.query;
    const parts = [...new Set(data.filter(item => item.code === code && item.book === book && item.title === title && item.chapter === chapter).map(item => item.part))];
    res.json(parts);
});

// Get all subparts for a code, book, title, chapter, and part
app.get('/subparts', (req, res) => {
    const { code, book, title, chapter, part } = req.query;
    const subparts = [...new Set(data.filter(item => item.code === code && item.book === book && item.title === title && item.chapter === chapter && item.part === part).map(item => item.subpart))];
    res.json(subparts);
});

// Get detailed information for a specific code and section
app.get('/info', (req, res) => {
    const { code, section } = req.query;
    const decodedCode = decodeURIComponent(code);
    const decodedSection = decodeURIComponent(section);
    const detail = data.find(item => item.code === decodedCode && item.section === decodedSection);
    if (detail) {
        res.json(detail);
    } else {
        res.status(404).json({ message: 'Detail not found' });
    }
});


// Helper function to search for a keyword in all columns
const searchKeyword = (keyword, data) => {
    const words = keyword.split(' ');
    return data.filter(item => {
        return words.some(word => {
            return Object.values(item).some(value => {
                return value.includes(word);
            });
        });
    });
};

// Search for a keyword in every column
app.get('/search', (req, res) => {
    const { keyword } = req.query;
    if (!keyword) {
        return res.status(400).json({ message: 'Keyword is required' });
    }
    const results = searchKeyword(keyword, data).slice(0, 10);
    res.json(results);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
