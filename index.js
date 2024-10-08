require("dotenv").config();
var express = require("express");
var morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person.js");

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("body", (req) => {
	return JSON.stringify(req.body);
});

// Use morgan with custom format
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons);
	});
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
	Person.findById(request.params.id).then((person) => {
		response.json(person);
	});
});

app.delete("/api/persons/:id", (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
	const body = request.body;

	if (!body.name) {
		return response.status(400).json({
			error: "name missing",
		});
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then((savedPerson) => {
			response.json(savedPerson);
		})
		.catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
	const body = request.body;
	console.log(request.params.id);

	const person = {
		name: body.name,
		number: body.number,
	};

	Person.findByIdAndUpdate(request.params.id, person, { new: true })
		.then((updatedNote) => {
			response.json(updatedNote);
		})
		.catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
