const { after, afterEach, before, describe, it } = require('mocha')
const chai = require('chai')
const { createSandbox } = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const { getAllVillains, getVillainBySlug, saveNewVillain } = require('../../controllers/villains')

chai.use(sinonChai)
const { expect } = chai

describe('Controllers-Villains', () => {
  let sandbox 

  before() => {
    sandbox = createSandbox()
  }

  afterEach(() => {
    sandbox.reset()
  })

  after(() => {
    sandbox.restore()
  })

  describe('getAllVillains', () => {})

  describe('getVillainBySlug', () => {})

  describe('saveNewVillain', () => {})

})
