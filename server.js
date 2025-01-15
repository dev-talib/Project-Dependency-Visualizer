const express = require('express');
const app = express();
const port = 5000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/data', (req, res) => {
    res.json({
        "nodes": [
            {"id": "Project A"},
            {"id": "Project B"},
            {"id": "Project C"},
            {"id": "Library X"},
            {"id": "Library Y"},
            {"id": "Library Z"},
            {"id": "Utility M"},
            {"id": "Utility N"}
        ],
        "links": [
            {"source": "Project A", "target": "Library X"},
            {"source": "Project B", "target": "Library X"},
            {"source": "Project C", "target": "Library Y"},
            {"source": "Project A", "target": "Library Y"},
            {"source": "Library X", "target": "Utility M"},
            {"source": "Library Y", "target": "Utility N"},
            {"source": "Utility M", "target": "Library Z"},
            {"source": "Library Z", "target": "Library X"}, // Circular dependency
            {"source": "Project B", "target": "Utility N"},
            {"source": "Utility N", "target": "Project B"}  // Circular dependency
        ]
    }
    );
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
