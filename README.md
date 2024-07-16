
`node src/utils/user.generator.js`
`node src/utils/generateSQL.js`

now on the terminal where postress service is running, run this:
`psql -U chandraprakashpal -d user_management -f insertUsers.sql`
(if it gives duplicate username remove that user and then re run it)

http://localhost:3000/users/search?username=A&sortBy=age&sortOrder=DESC

Didn't update or delete userId from jwt authentication because I assume admin can delete others.
