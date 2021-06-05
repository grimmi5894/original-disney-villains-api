const { after, afterEach, before, beforeEach, describe, it } = require('mocha')
const chai = require('chai')
const { createSandbox } = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const { mockVillainList, mockVillain, mockPostVillainData, mockPostVillainResponse } = require('../mocks/villains')
const { getAllVillains, getVillainBySlug, saveNewVillain } = require('../../controllers/villains')
const { response, request } = require('express')

chai.use(sinonChai)
const { expect } = chai

describe('Controllers-Villains', () => {
  let response
  let sandbox
  let stubbedSend
  let stubbedSendStatus
  let stubbedFindAll
  let stubbedFindOne
  let stubbedStatus
  let stubbedStatusDotSend

  before(() => {
    sandbox = createSandbox()

    stubbedSend = sandbox.stub()
    stubbedSendStatus = sandbox.stub()
    stubbedFindAll = sandbox.stub(models.villains, 'findAll')
    stubbedFindOne = sandbox.stub(models.villains, 'findOne')
    stubbedStatus = sandbox.stub()
    stubbedStatusDotSend = sandbox.stub()

    response = {
      send: stubbedSend,
      sendStatus: stubbedSendStatus,
      status: stubbedStatus
    }
  })

  beforeEach(() => {
    stubbedStatus.returns({ send: stubbedStatusDotSend })
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

    it('responds with a 500 status and error message when database call throws error', async () => {
      stubbedFindAll.throws('ERROR!')

      await getAllVillains({}, response)

      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to retrieve villains, please try again')
    })
  })

  describe('getVillainBySlug', () => {
    it('retrieves villain associated with slug sent from database and sends JSON using response.send()', async () => {
      stubbedFindOne.returns(mockVillain)
      const request = { params: { slug: 'hades' } }

      await getVillainBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'hades' } })
      expect(stubbedSend).to.have.been.calledWith(mockVillain)
    })

    it('responds with 404 status when no matching villain is found', async () => {
      stubbedFindOne.returns(null)
      const request = { params: { slug: 'unknown-slug' } }

      await getVillainBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'unknown-slug' } })
      expect(stubbedSendStatus).to.have.been.calledWith(404)
    })

    it('responds with a 500 status and error message when database call throws error', async () => {})
  })

  describe('saveNewVillain', () => {})

})
