// npm
import test from "ava"

// core
import { AssertionError } from "assert"

// self
import DocsDb from "."

test("create and update doc", (t) => {
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

test("revert doc (nothing)", (t) => {
  const db = new DocsDb()
  t.throws(() => db.revertDoc("joe"), AssertionError, "nothing to revert")
})

test("revert doc", (t) => {
  const db = new DocsDb()
  const { _rev } = db.updateDoc({ _id: "joe", fee: 1 })
  const doc = db.updateDoc({ _id: "joe", fee: 2 }, _rev)
  t.is(doc.fee, 2)
  t.throws(() => db.revertDoc("joe"), AssertionError, "revs should match")
  const doc2 = db.revertDoc("joe", doc._rev)
  t.is(doc2.fee, 1)
})
