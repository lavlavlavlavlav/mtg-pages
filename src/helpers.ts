import { Dispatch } from 'react';
import {
  BUCKET_URL,
  OldCard,
  Card,
  CardCategory,
  Status,
  Log,
  BUCKET_KEY,
} from './constants';
import { Action, ACTIONS, State } from './reducer';
import { v4 as uuidv4 } from 'uuid';

// export async function loadCardsFromBucket(): Promise<{
//   cards: Card[];
//   categories: CardCategory[];
// }> {
//   try {
//     const response = await fetch(BUCKET_URL + '/data');
//     const data = await response.json();

//     if ('represents' in data['cards'][0]) {
//       // cards are in the old format -> reformatting
//       const originDate = new Date(-8640000000000000);
//       const newCards: Card[] = [];
//       const cards: OldCard[] = data['cards'];
//       const cardCategories: CardCategory[] = [];
//       for (const card of cards) {
//         if ('represents' in card && card.represents) {
//           const logs: Log[] = [];
//           const oldLogs: string[] =
//             'logs' in card
//               ? card.logs.split('\n').filter((str: string) => str !== '')
//               : [];
//           for (const oldLog of oldLogs) {
//             const dateString: string | undefined = oldLog
//               .split(']')[0]
//               .split('[')[1];

//             const timestamp: Date = dateString
//               ? new Date(dateString)
//               : originDate;
//             const to: Status = oldLog.includes('banned')
//               ? Status.Banned
//               : Status.Allowed;
//             logs.push({
//               timestamp: timestamp,
//               to: to,
//               from: Status.Allowed,
//               user: 'Lav',
//             });
//           }
//           const newCategory: CardCategory = {
//             id: cardCategories.length,
//             name: card.name,
//             status: card.status == 'banned' ? Status.Banned : Status.Allowed,
//             exampleCards: [
//               card.name,
//               "Agadeem's Awakening // Agadeem, the Undercrypt",
//             ],
//             comments: [
//               { poster: 'Lav', timestamp: originDate, message: card.comments },
//             ],
//             markedForDiscussion: card.discuss,
//             logs: logs,
//           };
//           cardCategories.push(newCategory);
//         } else {
//           const logs: Log[] = [];
//           const oldLogs: string[] =
//             'logs' in card
//               ? card.logs.split('\n').filter((str: string) => str !== '')
//               : [];
//           for (const oldLog of oldLogs) {
//             const dateString: string | undefined = oldLog
//               .split(']')[0]
//               .split('[')[1];

//             const timestamp: Date = dateString
//               ? new Date(dateString)
//               : originDate;
//             const to: Status = oldLog.includes('banned')
//               ? Status.Banned
//               : Status.Allowed;
//             logs.push({
//               timestamp: timestamp,
//               to: to,
//               from: Status.Allowed,
//               user: 'Lav',
//             });
//           }
//           const newCard: Card = {
//             name: card.name,
//             status: card.status == 'banned' ? Status.Banned : Status.Allowed,
//             comments: card.comments
//               ? [
//                   {
//                     poster: 'Lav',
//                     timestamp: originDate,
//                     message: card.comments,
//                   },
//                 ]
//               : [],
//             logs: logs,
//             markedForDiscussion: card.discuss,
//           };
//           newCards.push(newCard);
//         }
//       }
//       return { cards: newCards, categories: cardCategories };
//     }

//     return { cards: data['cards'], categories: data['categories'] };
//   } catch (error) {
//     console.error('Error:', error);
//     return { cards: [], categories: [] }; // Return an empty array in case of error
//   }
// }

// export async function saveCardsToBucket(bucketData: any): Promise<void> {
//   const response = await fetch(BUCKET_URL + '/data', {
//     method: 'POST',
//     body: JSON.stringify(bucketData),
//   });
//   if (response.status == 200) {
//     alert('Success');
//   } else {
//     console.log('Error while saving - response:');
//     console.log(JSON.stringify(response));
//   }
// }

export async function fetchBannedCardsAndCategories(
  dispatch: Dispatch<Action>
) {
  const response = await fetch(
    BUCKET_URL + '/cardsandcategories' + '?key=' + BUCKET_KEY
  );
  const data = await response.json();
  if (!('cards' in data) || !('categories' in data)) {
    return false;
  } else {
    data['cards'].forEach((card: any) => {
      if (!('id' in card)) {
        card['id'] = uuidv4();
      }
    });
    data['categories'].forEach((cat: any) => {
      if (!('id' in cat) || typeof cat['id'] === 'number') {
        cat['id'] = uuidv4();
      }
    });
    dispatch({ type: ACTIONS.SETCARDS, payload: { cards: data['cards'] } });
    dispatch({
      type: ACTIONS.SETCATEGORIES,
      payload: { categories: data['categories'] },
    });
    return true;
  }
}

export async function saveBannedCardsAndCategories(
  state: State,
  dispatch: Dispatch<Action>
): Promise<void> {
  dispatch({ type: ACTIONS.SETSAVED });
  if (!state.cards) return;
  const response = await fetch(
    BUCKET_URL + '/cardsandcategories' + '?key=' + BUCKET_KEY,
    {
      method: 'POST',
      body: JSON.stringify({
        cards: state.cards,
        categories: state.categories,
      }),
    }
  );
  if (response.status == 200) {
    console.log('successfully saved data');
  } else {
    console.log('Error while saving - response:');
    console.log(JSON.stringify(response));
  }
}
