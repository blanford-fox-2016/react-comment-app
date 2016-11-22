# react-comment-app
simple CRUD comment (markdown) with express framework, database JSON file and react.js

# How to Run
`npm i -g live-server nodemon cors`
1. client
```sh
cd client
live-server
```
2. server
```sh
cd server
npm install
npm run dev
```

# API End point
Default development port & route server : http://localhost:3000/
| Routes | HTTP | Description |
|--------|------|-------------|
| /api/comments | POST | add new comment |
| /api/comments/ | GET | get all comments |
| /api/comments/:id | PUT | edit a comment |
| /api/comments/:id | DELETE | delete a comment |

# Contributor
Ken Duigraha Putra &copy; 2016

# License
MIT
