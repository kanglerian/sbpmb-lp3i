import axios from "axios";

export const getProvinces = () => {
  return new Promise( async (resolve, reject) => {
    await axios.get('/json/api-indonesia/provinces.json')
    .then((response) => {
      resolve(response.data)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

export const getRegencies = (id) => {
  return new Promise( async (resolve, reject) => {
    await axios.get(`/json/api-indonesia/regencies/${id}.json`)
    .then((response) => {
      resolve(response.data)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

export const getDistricts = (id) => {
  return new Promise( async (resolve, reject) => {
    await axios.get(`/json/api-indonesia/districts/${id}.json`)
    .then((response) => {
      resolve(response.data)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

export const getVillages = (id) => {
  return new Promise( async (resolve, reject) => {
    await axios.get(`/json/api-indonesia/villages/${id}.json`)
    .then((response) => {
      resolve(response.data)
    })
    .catch((error) => {
      reject(error)
    })
  })
}