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
  t.is(db.historyCount, 2)

  const ids = Array.from(db.docIds)
  t.is(ids[0], "joe")
  t.is(ids.length, 1)
})

test("get doc", (t) => {
  const db = new DocsDb()
  const { _rev } = db.updateDoc({ _id: "joe", fee: 1 })
  t.falsy(db.getDoc("joe", 1))
  const doc = db.updateDoc({ _id: "joe", fee: 2 }, _rev)
  t.is(db.getDoc("joe").fee, 2)
  t.is(db.getDoc("joe", 0).fee, 1)
  t.is(db.getDoc("joe", "0").fee, 1)
  t.is(db.getDoc("joe", _rev).fee, 1)
  t.falsy(db.getDoc("joe", _rev + "nope"))
  t.falsy(db.getDoc("joe", 10))
  t.falsy(db.getDoc("joe666", 666))
  t.falsy(db.getDoc("joe", "1-83RphmWOzkQ3kKypb6FM0"))
  t.falsy(db.getDoc("joe666", "1-83RphmWOzkQ3kKypb6FM0"))
  t.is(db.getDoc("joe", 1).fee, 2)
  t.is(db.getDoc("joe", "1").fee, 2)
  t.is(db.getDoc("joe", doc._rev).fee, 2)
  t.is(db.getDoc("joe", 0).fee, 1)
})

test("revert doc (nothing)", (t) => {
  const db = new DocsDb()
  t.throws(() => db.revertDoc("joe"), {
    instanceOf: AssertionError,
    message: "nothing to revert",
  })
})

test("revert doc", (t) => {
  const db = new DocsDb()
  const { _rev } = db.updateDoc({ _id: "joe", fee: 1 })
  const doc = db.updateDoc({ _id: "joe", fee: 2 }, _rev)
  t.is(doc.fee, 2)
  t.throws(() => db.revertDoc("joe"), {
    instanceOf: AssertionError,
    message: "revs should match",
  })
  const doc2 = db.revertDoc("joe", doc._rev)
  t.is(doc2.fee, 1)
  const doc3 = db.updateDoc({ _id: "joe", fee: 7 }, doc2._rev)
  const doc4 = db.revertDoc("joe", doc3._rev, 0)
  t.is(doc4.fee, 1)
  t.is(doc4._rev, "4-I2jkiBQqcBl4tGmfBVyRw")
})

test("export/import", (t) => {
  const db = new DocsDb()
  db.updateDoc({ _id: "joe", fee: 1 })
  const db2 = new DocsDb(db.export)
  const { _rev } = db2.getDoc("joe")
  t.is(_rev, "0-I2jkiBQqcBl4tGmfBVyRw")
  t.is(db.docCount, 1)
})

test("metas", (t) => {
  const db = new DocsDb()
  db.updateDoc({ _id: "joe", fee: 1 })
  const [{ _rev }] = db.docMetas
  t.is(_rev, "0-I2jkiBQqcBl4tGmfBVyRw")
})

test("delete doc", (t) => {
  const db = new DocsDb()
  const { _rev } = db.updateDoc({ _id: "joe", fee: 1 })
  t.is(db.docCount, 1)
  const doc = db.deleteDoc("joe", _rev)
  t.is(db.docCount, 1) // count includes deleted
  t.falsy(doc.fee)
  t.is(doc._deleted, true)
})
