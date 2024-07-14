
`node src/utils/user.generator.js`
`node src/utils/generateSQL.js`

now on the terminal where postress service is running, run this:
`psql -U chandraprakashpal -d user_management -f insertUsers.sql`
(if it gives duplicate username remove that user and then re run it)
