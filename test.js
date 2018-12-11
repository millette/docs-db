// npm
import test from "ava"

// self
import DocsDb from "."

test("first test, woot", (t) => {
  const db = new DocsDb()
  const { _rev } = db.updateDoc({ _id: "joe", fee: 1 })
  const s1 = db.size
  t.is(_rev, "0-I2jkiBQqcBl4tGmfBVyRw")
  t.is(db.docCount, 1)
  db.updateDoc({ _id: "joe", fee: 1 }, _rev)
  const s2 = db.size
  t.is(db.docCount, 1)
  t.is(s1, s2)
  const doc = db.updateDoc({ _id: "joe", fee: 2 }, _rev)
  const s3 = db.size
  t.is(db.docCount, 1)
  t.not(s1, s3)
})
