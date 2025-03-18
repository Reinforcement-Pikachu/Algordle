// database connection 


require('dotenv').config();
const { Pool } = require('pg');

console.log('db.js is running ')

DATABASE_URL= process.env.DATABASE_URL || 'postgresql://postgres:x9nvbUNw1BCxrTzw@db.srxfcvppvrfwwanzweqc.supabase.co:5432/postgres' ;

console.log(
    'DATABASE_URL', DATABASE_URL
);

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },

});

console.log('trying to connect to database')

const timeout = setTimeout(() => {
    console.error('connection is taking to long');
    process.exit(1);
}, 5000);

pool.connect()
    .then(() => {
        clearTimeout(timeout);
        console.log('database connected succefulley'); 
        return pool.query('SELECT NOW()')
    })
    .then((res) => {
        console.log('test query result:', res.rows[0])
    })
    .catch((err) => {
        clearTimeout(timeout);
        console.error('Database connection error:', err)
    });

module.exports = pool;