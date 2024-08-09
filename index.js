var express = require("express");
var morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

morgan.token("body", (req) => {
	return JSON.stringify(req.body);
});

// Use morgan with custom format
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
	{
		id: "1",
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: "2",
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: "3",
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: "4",
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.get("/api/persons", (request, response) => {
	response.json(persons);
});

app.get("/api/info", (request, response) => {
	const requestTime = new Date().toISOString();
	const entriesCount = persons.length;

	const responseContent = `
    <p>Request received at: ${requestTime}</p>
    <p>Phonebook has ${entriesCount} entries</p>
  `;

	response.send(responseContent);
});

app.get("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	person = persons.find((person) => person.id === id);
	if (!person) {
		response.status(404).end();
	}
	response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	persons = persons.filter((person) => person.id !== id);

	response.status(204).end();
});

app.post("/api/persons", (request, response) => {
	const body = request.body;
	const uniqueName = persons.find((person) => person.name == body.name);

	if (!body.name) {
		return response.status(400).json({
			error: "name missing",
		});
	} else if (uniqueName) {
		return response.status(400).json({
			error: "name must be unique",
		});
	}

	const person = {
		id: String(Math.floor(Math.random() * 10000)),
		name: body.name,
		number: body.number,
	};

	persons = persons.concat(person);

	response.json(persons);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
