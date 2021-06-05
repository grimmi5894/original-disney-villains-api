const {
  after, afterEach, before, beforeEach, describe, it
} = require('mocha')
const chai = require('chai')
const { createSandbox } = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const { mockVillainList, mockVillain, mockPostVillainData, mockPostVillainResponse } = require('../mocks/villains')
const { getAllVillains, getVillainBySlug, saveNewVillain } = require('../../controllers/villains')
// eslint-disable-next-line no-unused-vars
const { response, request } = require('express')

chai.use(sinonChai)
const { expect } = chai

describe('Controllers-Villains', () => {
  let response
  let sandbox
  let stubbedCreate
  let stubbedSend
  let stubbedSendStatus
  let stubbedFindAll
  let stubbedFindOne
  let stubbedStatus
  let stubbedStatusDotSend

  before(() => {
    sandbox = createSandbox()

    stubbedCreate = sandbox.stub(models.villains, 'create')
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

    it('responds with a 500 status and error message when database call throws error', async () => {
      stubbedFindOne.throws('ERROR!')
      const request = { params: { slug: 'error' } }

      await getVillainBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'error' } })
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to retrieve villain, please try again')
    })
  })


  describe('saveNewVillain', () => {
    it('creates new villain database record from data provided and returns 200 status and new record', async () => {
      stubbedCreate.returns(mockPostVillainResponse)
      const request = { body: mockPostVillainData }

      await saveNewVillain(request, response)

      expect(stubbedCreate).to.have.been.calledWith(mockPostVillainData)
      expect(stubbedStatus).to.have.been.calledWith(201)
      expect(stubbedStatusDotSend).to.have.been.calledWith(mockPostVillainResponse)
    })

    it('responds with 400 status and error message when not all required data is provided', async () => {
      const request = { body: { name: mockPostVillainData.name, slug: mockPostVillainData.slug } }

      await saveNewVillain(request, response)

      expect(stubbedCreate).to.have.callCount(0)
      expect(stubbedStatus).to.have.been.calledWith(400)
      expect(stubbedStatusDotSend).to.have.been.calledWith('The following parameters are required: name, movie, slug')
    })
  })
})
