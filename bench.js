"use strict"

// core
const os = require("os")
const fs = require("fs")

const freeMem0 = os.freemem()

// npm
const chance = require("chance").Chance()

// self
const DocsDb = require(".")

// const docs = require("./out-fake.json")

const makeContent = () => {
  const n = Math.round(Math.random() * 5 + 2)
  const ps = []
  let r
  for (r = 0; r < n; ++r) ps.push(`<p>${chance.paragraph()}</p>`)
  return ps.join("")
}

const makeTitle = () => chance.sentence().slice(0, -1)

const makeId = () => {
  const n = Math.round(Math.random() * 3 + 1)
  let r
  const words = []
  for (r = 0; r < n; ++r) words.push(chance.word())
  return words.join("-")
}

const makeDoc = () => ({
  _id: makeId(),
  title: makeTitle(),
  content: makeContent(),
})

const bench = (num) => {
  const now0 = Date.now()
  const db = new DocsDb()
  // const db = new DocsDb(docs)
  const now = Date.now()
  const freeMem1 = os.freemem()

  let r
  for (r = 0; r < num; ++r) {
    let doc
    try {
      doc = makeDoc()
      db.updateDoc(doc)
    } catch (e) {
      const { _rev } = db.getDoc(doc._id)
      db.updateDoc(doc, _rev)
    }
  }

  const freeMem2 = os.freemem()
  console.log(Math.round((now - now0) / num))
  console.log(Math.round((Date.now() - now) / num))
  console.log(db.docCount)
  console.log(db.historyCount)
  console.log(freeMem0 - freeMem1)
  console.log(Math.round((freeMem1 - freeMem2) / num))
  fs.writeFileSync("out-fake.json", JSON.stringify(db.export))
}

bench(5000)
