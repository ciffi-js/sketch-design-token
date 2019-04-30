const weights = {
  3: 300,
  5: 400,
  9: 700
}

const getWeight = (weight) => {
  return weights[weight]
}

module.exports = getWeight