# docs-db

[![Build Status](https://travis-ci.org/millette/docs-db.svg?branch=master)](https://travis-ci.org/millette/docs-db)
[![Coverage Status](https://coveralls.io/repos/github/millette/docs-db/badge.svg?branch=master)](https://coveralls.io/github/millette/docs-db?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/millette/docs-db.svg)](https://gemnasium.com/github.com/millette/docs-db)

> Simple docs database with history support.

## Install

```
$ npm install docs-db
```

## Usage

```js
const DocsDb = require("docs-db")

const db = new DocsDb()
```

## API

### DocsDb([data])

#### data

Type: `object` with `db` and `history` keys

```js
const DocsDb = require("docs-db")

const db = new DocsDb()
```

### db.export

Export the whole content with history in an object with `db` and `history` keys. You can pass the result to the constructor to initialize it with content.

### db.historyCount

### db.docCount

### db.docIds

### db.docMetas

### db.sizeCurrent

### db.sizeHistory

### db.size

### db.getDoc(\_id, [_rev])

### db.deleteDoc(\_id, currentRev)

### db.revertDoc(\_id, currentRev, [to])

### db.updateDoc(newDoc, [currentRev])

## License

AGPL-v3 © 2018 [Robin Millette](http://robin.millette.info)
