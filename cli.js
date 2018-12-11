"use strict";

// self
const DocsDb = require(".");
// const it = require('./doop.json')

const db = new DocsDb();

/*
db.updateDoc({ _id: 'joe', fee: 0 })

setTimeout(() => db.updateDoc({ _id: 'joe', fee: 1 }), 50)

setTimeout(() => db.updateDoc({ _id: 'joe2', fee: 22 }), 150)

setTimeout(() => db.updateDoc({ _id: 'joe', fee: 2 }), 150)

setTimeout(() => db.revertDoc('joe', 0), 300)
*/

/*
setTimeout(() => {
  // console.log(db.db)
  // console.log(db.history)
  // console.log(db.docIds)
  console.log(db.sizeCurrent, db.sizeHistory, db.size, db.docCount, db.historyCount)
}, 500)
*/

console.log("s0");
const { _rev } = db.updateDoc({ _id: "joe", fee: 1 });
console.log("s1", _rev);
// db.updateDoc({ _id: 'joe2', fee: 22 })
// console.log('s2')
const d2 = db.updateDoc({ _id: "joe", fee: 2 }, _rev);
const d2Rev = d2._rev;
console.log("d2Rev", d2Rev);
const d3 = db.deleteDoc("joe", d2Rev);
const d3Rev = d3._rev;
db.deleteDoc("joe", d3Rev);
const d4 = db.deleteDoc("joe", d3Rev);
const d4Rev = d4._rev;
db.deleteDoc("joe", d4Rev);

// console.log(db._db)
// console.log(db.sizeCurrent, db.sizeHistory, db.size, db.docCount, db.historyCount)
