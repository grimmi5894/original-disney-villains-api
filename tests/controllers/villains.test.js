const { after, afterEach, before, describe, it } = require('mocha')
const chai = require('chai')
const { createSandbox } = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const { mockVillainList, mockVillain, mockPostVillainData, mockPostVillainResponse } = require('../mocks/villains')
const { getAllVillains, getVillainBySlug, saveNewVillain } = require('../../controllers/villains')
const { response } = require('express')

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
      stubbedFindAll.returns(mockVillainList)

      await getAllVillains({}, response)

      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedSend).to.have.been.calledWith(mockVillainList)
    })
  })

  describe('getVillainBySlug', () => {})

  describe('saveNewVillain', () => {})

})
