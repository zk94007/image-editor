import axios from 'axios';

export function searchPexelImages(searchValue) {
  return new Promise((resolve, reject) => {
    axios.get(`${process.env.REACT_APP_API_URL}/pexel/search/images?searchQuery=${searchValue}`)
      .then((res) => {
        resolve(res.data.photos);
      }).catch(err => {
        console.log('error while search pexel images.', err);
        reject(err);
      });
  })
}

export function searchPixabayImages(searchValue) {
  return new Promise((resolve, reject) => {
    axios.get(`${process.env.REACT_APP_API_URL}/pixabay/search/images?searchQuery=${searchValue}`)
      .then((res) => {
        console.log("pixabay: ", res);
        resolve(res.data.hits);
      }).catch(err => {
        console.log('error while search pixabay images.', err);
        reject(err);
      });
  })
}

export function searchUnsplashImages(searchValue) {
  return new Promise((resolve, reject) => {
    axios.get(`${process.env.REACT_APP_API_URL}/unsplash/search/images?searchQuery=${searchValue}`)
      .then((res) => {
        resolve(res.data.results);
      }).catch(err => {
        console.log('error while search unsplash images.', err);
        reject(err);
      });
  })
}