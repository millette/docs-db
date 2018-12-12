"use strict"

// npm
const fast = require("fast-json-stable-stringify")

// core
const { createHash } = require("crypto")
const assert = require("assert").strict

class DocsDb {
  constructor(data = {}) {
    assert.equal(typeof data, "object", "first argument should be an object")
    this._db = new Map(data.db)
    this._history = new Map(data.history)
    this._onlyMetas = this._onlyMetas.bind(this)
  }

  get export() {
    return {
      db: Array.from(this._db),
      history: Array.from(this._history),
    }
  }

  get historyCount() {
    return (
      this._history.size +
      Array.from(this._history.values()).reduce((a, b) => a + b.length, 0)
    )
  }

  get docCount() {
    return this._db.size
  }

  get docIds() {
    return this._db.keys()
  }

  get docMetas() {
    return Array.from(this._db.values()).map(this._onlyMetas)
  }

  get sizeCurrent() {
    return JSON.stringify(Array.from(this._db)).length
  }

  get sizeHistory() {
    return JSON.stringify(Array.from(this._history)).length
  }

  get size() {
    return this.sizeCurrent + this.sizeHistory
  }

  getDoc(_id, _rev) {
    const doc = this._db.get(_id)
    if (_rev === undefined) return doc

    let hash
    let n = Math.floor(_rev)
    let a = `${n}`

    assert(
      typeof _rev === "string" || typeof _rev === "number",
      "_rev should be a string or integer",
    )

    if (typeof _rev === "string") {
      const bla = _rev.split("-")
      a = bla[0]
      hash = bla[1]
      n = parseInt(a, 10)
    }

    if (hash && _rev === doc._rev) return doc
    if (!hash && a === doc._rev.split("-")[0]) return doc
    const docs = this._history.get(_id)
    if (!docs || !docs.length) return
    if (!hash || _rev === docs[n]._rev) return docs[n]
  }

  deleteDoc(_id, currentRev) {
    return this.updateDoc({ _id, _deleted: true }, currentRev)
  }

  revertDoc(_id, currentRev, to) {
    const versions = this._history.get(_id)
    assert(versions && versions.length, "nothing to revert")

    if (to === undefined) to = versions.length - 1
    assert.equal(typeof to, "number", "to should be a number")
    assert(to >= 0, "to should be a positive number")
    return this.updateDoc(versions[Math.floor(to)], currentRev)
  }

  updateDoc(newDoc, currentRev) {
    assert.equal(
      typeof newDoc,
      "object",
      "expecting an object as a first argument",
    )
    assert.equal(
      typeof newDoc._id,
      "string",
      "expecting a string for _id field",
    )
    const oldDoc = this._db.get(newDoc._id) || {}
    const newDocHash = this._getHash(newDoc)
    let v
    if (oldDoc._rev) {
      assert.equal(oldDoc._rev, currentRev, "revs should match")
      const [a, oldDocHash] = oldDoc._rev.split("-")
      if (oldDocHash === newDocHash) return oldDoc
      v = parseInt(a, 10) + 1
      this._updateHistory(oldDoc)
    } else {
      v = 0
      this._history.set(newDoc._id, [])
    }

    const _updated = Date.now()
    const _created = oldDoc._created || _updated
    const _rev = `${v}-${newDocHash}`
    const ret = {
      ...newDoc,
      _rev,
      _created,
      _updated,
    }
    this._db.set(ret._id, ret)
    return ret
  }

  // private
  _onlyMetas(doc) {
    let r
    const out = {}
    for (r in doc) {
      if (r[0] === "_") out[r] = doc[r]
    }
    return out
  }

  _dropMetas(doc) {
    let r
    const out = {}
    for (r in doc) {
      if (r[0] !== "_") out[r] = doc[r]
    }
    return out
  }

  _getHash(doc) {
    const h = createHash("md5")
    h.update(fast(this._dropMetas(doc)))
    return h
      .digest("base64")
      .replace(/[-/+]/g, "")
      .replace(/=+$/g, "")
  }

  _updateHistory(doc) {
    this._history.get(doc._id).push(doc)
  }
}

module.exports = DocsDb
