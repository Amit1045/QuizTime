
import express from "express"
import pg from "pg"
import bodyParser from "body-parser"
const app = express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));

let quiz = []
let totalCorrect = 0
let currentQuestion = {}

const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'world',
    password: '1234567',
    port: 5000, // Default PostgreSQL port
});

db.connect().then(() => {
    console.log('Connected to PostgreSQL database!');
    db.query("select * from capitals", (err, res) => {
        if (err) {
            console.error("Error executing query", err.stack);
        } else {
            quiz = res.rows
        }
    })
})
    .catch(err => {
        console.error('Error connecting to the database:', err);
    })


app.get("/", async (req, res) => {
    totalCorrect = 0
    await nextQuestion()
    res.render("./index.ejs",
        {
            question: currentQuestion,
            totalScore: totalCorrect
        })
})


app.post("/submit", (req, res) => {
    let answer = req.body.answer.trim()
    let isCorrect = false
    if (currentQuestion && currentQuestion.capital) {
         if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
            totalCorrect++;
            isCorrect=true;
        }
    }
    nextQuestion();
    res.render("index.ejs", {
        question: currentQuestion,
        wasCorrect: isCorrect,
        totalScore: totalCorrect
    })

})

async function nextQuestion() {
    const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
    currentQuestion = randomCountry;
    //  console.log(JSON.stringify(randomCountry));

}

app.listen(port, () => {
    console.log(`server is running on port http://localhost:3000`);

})
