const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    { id:1, name: 'course1'},
    { id:2, name: 'course2'},
    { id:3, name: 'course3'}
];

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = getCourse(req.params.id);
    if (!course) {
        res.status(404).send('The course with the given ID was not found!');
        res.send(course);
    }
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);

    if (error) return res.send(400).send(error.details[0].message);
   
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = getCourse(req.params.id);
    if (!course) return res.status(404).send('The course with the given ID was not found!');

    const { error } = validateCourse(req.body);

    if (error) return res.send(400).send(error.details[0].message);
     
    // UPDATE
    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    const course = getCourse(req.params.id);
    if (!course) return res.status(404).send('The course with the given ID was not found!');
    
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

function getCourse(id) {
    return courses.find(c => c.id === parseInt(id));
}

// PORT
const port = 3000;
const host = "0.0.0.0";

app.listen(port, host, () => {
    console.log(`Listening on port ${port}...`)
});


