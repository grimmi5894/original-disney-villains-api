const models = require('../models')

const getAllVillains = async (request, response) => {
  const villains = await models.villains.findAll()

  return response.send(villains)
}

const getVillainBySlug = async (request, response) => {
  const { slug } = request.params
  const matchedVillain = await models.villains.findOne({ where: { slug } })

  return matchedVillain
    ? response.send(matchedVillain)
    : response.sendStatus(404).send('Error-No Match Found')
}

module.exports = {
  getAllVillains, getVillainBySlug
}
