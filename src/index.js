import express from 'express'
import mariadb from 'mariadb'
import cookieParser from 'cookie-parser'
import multer from 'multer'

const app = express()

app.use(express.json()) // middleware parses json for each request
app.use(cookieParser()) // middleware to parse cookies in the request

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
})

const upload = multer({ storage: storage })

// Static file serving - serving images from the uploads directory
app.use('/images', express.static('uploads'))

// Endpoint to upload an image and link it to a user
app.post('/user/:userid/upload-image', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.')
    }

    const { userid } = req.params
    const imagePath = `/images/${req.file.filename}`

    try {
        const conn = await pool.getConnection()
        const result = await conn.query("UPDATE users SET profileImage = ? WHERE id = ?", [imagePath, userid])
        conn.end()
        if (result.affectedRows > 0) {
            res.status(200).json({
                message: "Image uploaded and linked to user successfully!",
                filename: imagePath
            })
        } else {
            res.status(404).json({ message: "User not found" })
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})


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

// search endpoint with cookie tracking
app.get('/search', async (req, res) => {
    const { string } = req.query

    // Check for existing search count cookie, increment or initialize it
    let searchCount = req.cookies.searchCount ? parseInt(req.cookies.searchCount) : 0
    searchCount++

    // Update cookie with new count
    res.cookie('searchCount', searchCount, { maxAge: 86400000, httpOnly: true }) // Expires in 1 day

    try {
        const conn = await pool.getConnection()
        const result = await conn.query("SELECT id, name, email FROM users WHERE name LIKE CONCAT('%', ?, '%') OR email LIKE CONCAT('%', ?, '%')", [string, string])
        conn.end()
        res.json({ result: result, searchCount: searchCount })
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

// Patch endpoint to update user details, including profile image
app.patch('/user/:userid', async (req, res) => {
    const { userid } = req.params
    const { name, email, profileImage } = req.body
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
    if (profileImage) {
        updates.push("profileImage = ?")
        values.push(profileImage)
    }
    if (values.length === 0) {
        res.status(400).json({ message: "No valid fields provided for update" })
        return
    }

    values.push(userid)

    try {
        const conn = await pool.getConnection()
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
