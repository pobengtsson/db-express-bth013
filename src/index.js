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

// Search endpoint
app.get('/search', async (req, res) => {
    const { string } = req.query
    try {
        const conn = await pool.getConnection()
        const result = await conn.query("SELECT id, name, email FROM users WHERE name LIKE CONCAT('%', ?, '%') OR email LIKE CONCAT('%', ?, '%')", [string, string])
        conn.end()
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Get user by ID
app.get('/user/:userid', async (req, res) => {
    const { userid } = req.params
    try {
        const conn = await pool.getConnection()
        const result = await conn.query("SELECT id, name, email FROM users WHERE id = ?", [userid])
        conn.end()
        if (result.length > 0) {
            res.json(result[0])
        } else {
            res.status(404).json({ message: "User not found" })
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Delete user
app.delete('/user/:userid', async (req, res) => {
    const { userid } = req.params
    try {
        const conn = await pool.getConnection()
        const result = await conn.query("DELETE FROM users WHERE id = ?", [userid])
        conn.end()
        if (result.affectedRows > 0) {
            res.json({ message: "User deleted successfully" })
        } else {
            res.status(404).json({ message: "User not found" })
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Patch user details
app.patch('/user/:userid', async (req, res) => {
    const { userid } = req.params
    const { name, email } = req.body
    try {
        const conn = await pool.getConnection()
        const updates = []
        const values = []
        if (name) {
            updates.push("name = ?")
            values.push(name)
        }
        if (email) {
            updates.push("email = ?")
            values.push(email)
        }
        if (values.length === 0) {
            res.status(400).json({ message: "No valid fields provided for update" })
            return
        }
        values.push(userid)
        const result = await conn.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values)
        conn.end()
        if (result.affectedRows > 0) {
            res.json({ message: "User updated successfully" })
        } else {
            res.status(404).json({ message: "User not found" })
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})


// Start the server
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
