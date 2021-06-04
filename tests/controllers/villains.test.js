const { describe, it } = require('mocha')
const chai = require('chai')
const { createSandbox } = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const { getAllVillains, getVillainBySlug, saveNewVillain } = require('../../controllers/villains')

chai.use(sinonChai)
const { expect } = chai
