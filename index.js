const express = require("express");
const cors = require("cors");

function generateId() {
	const maxId = notes.length > 0
		? Math.max(...notes.map(n => Number(n.id)))
		: 0

	return String(maxId + 1);
}

const requestLogger = (request, response, next) => {
	// Colores ANSI para consola
	const colors = {
		reset: '\x1b[0m',
		cyan: '\x1b[36m', // cyan
		key: '\x1b[33m',   // yellow
		green: '\x1b[32m'    // green
	};

	console.log(`${colors.key}Method:${colors.cyan} ${request.method}`);
	console.log(`${colors.key}Path:${colors.cyan} ${request.path}`);
	console.log(`${colors.key}Body:${colors.green} ${JSON.stringify(request.body)} ${colors.reset}\n`);
	next();
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static("dist"));

let notes = [
	{
		id: "1",
		content: "HTML is easy",
		important: true
	},
	{
		id: "2",
		content: "Browser can execute only JavaScript",
		important: false
	},
	{
		id: "3",
		content: "GET and POST are the most important methods of HTTP protocol",
		important: true
	}
];

app.get("/", (req, res) => {
	res.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (req, res) => {
	res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
	const id = req.params.id;
	const note = notes.find(note => note.id === id);

	if (note) {
		res.json(note);
	} else {
		res.status(404).end();
	}
});

app.delete("/api/notes/:id", (req, res) => {
	const id = req.params.id;
	notes = notes.filter(note => note.id !== id);
	res.status(204).end();
});

app.post("/api/notes", (request, response) => {
	const body = request.body;

	if (!body) {
		return response.status(400).json({
			error: "Content missing"
		});
	}

	const note = {
		content: body.content,
		important: body.important || false,
		id: generateId()
	};

	notes = notes.concat(note);
	response.json(note);
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
}

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
