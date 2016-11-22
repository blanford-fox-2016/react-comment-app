# react-comment-app

## Install Global Package

```
npm install -g nodemon liveserver express-generator bower
```

## Run Server

```
npm install
npm start
```

## Run Client

```
bower install
live-server
```

## Models

### comment

```
const Comment = new Schema({
    comment: {
        type: String,
        required: true
    }
})
```

## Routing

### API user

| Endpoint      | HTTP      | Description       |
| ----------    | -----     | ------------      |
| api/comments  | GET       | Get all comments  |
| api/comments  | POST      | Create comment    |
| api/comments  | DELETE    | Delete comment    |
