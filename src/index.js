import express from 'express'
import mariadb from 'mariadb'

const app = express()

app.use(express.json()) // middleware parses json for each request

// Set up MariaDB connection pool
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'bth013',
    password: 'foobar',
    database: 'demo'
})

// POST endpoint to insert data
app.post('/add-user', async (req, res) => { // notice! async
    let { name, email } = req.body
    try {
        const sql_template = "INSERT INTO users (name, email) VALUES (?, ?)"
        const conn = await pool.getConnection() // notice! await
        const result = await conn.query(sql_template, [name, email]) // again, await
        conn.end()
        res.status(200).json({ message: "User added successfully!", userId: Number(result.insertId) })
    } catch (err) {
        res.status(500).json({ message: "Error adding user", error: err.message })
    }
})

// Start the server
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
