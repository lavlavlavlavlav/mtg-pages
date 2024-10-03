export function loadCardsFromBucket(url: string) {
  console.log('##### ' + url);

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data['cards']);
    })
    .catch((error) => console.error('Error:', error));
}
