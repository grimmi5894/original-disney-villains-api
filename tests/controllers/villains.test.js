const { after, afterEach, before, describe, it } = require('mocha')
const chai = require('chai')
const { createSandbox } = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const { getAllVillains, getVillainBySlug, saveNewVillain } = require('../../controllers/villains')

chai.use(sinonChai)
const { expect } = chai

describe('Controllers-Villains', () => {
  let response
  let sandbox 
  let stubbedSend
  let stubbedSendStatus
  let stubbedFindAll

  before(() => {
    sandbox = createSandbox()

    stubbedSend = sandbox.stub()
    stubbedSendStatus = sandbox.stub()
    stubbedFindAll = sandbox.stub(models.villains, 'findAll')

    response = {
      send: stubbedSend,
      sendStatus: stubbedSendStatus
    }
  })

  afterEach(() => {
    sandbox.reset()
  })

  after(() => {
    sandbox.restore()
  })

  describe('getAllVillains', () => {
    it('gets a list of all villains from database and sends the JSON using response.send()', async () => {
      await getAllVillains({}, response)
    })
  })

  describe('getVillainBySlug', () => {})

  describe('saveNewVillain', () => {})

})
