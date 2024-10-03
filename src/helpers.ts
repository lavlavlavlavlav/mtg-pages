import { BUCKET_URL, Card } from './constants';

export async function loadCardsFromBucket(): Promise<Card[]> {
  try {
    const response = await fetch(BUCKET_URL);
    const data = await response.json();
    return data['cards'];
  } catch (error) {
    console.error('Error:', error);
    return []; // Return an empty array in case of error
  }
}
