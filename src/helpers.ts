import {
  BUCKET_URL,
  OldCard,
  Card,
  CardCategory,
  Status,
  Log,
} from './constants';

export async function loadCardsFromBucket(): Promise<{
  cards: Card[];
  categories: CardCategory[];
}> {
  try {
    const response = await fetch(BUCKET_URL);
    const data = await response.json();

    if ('represents' in data['cards'][0]) {
      // cards are in the old format -> reformatting
      const originDate = new Date(-8640000000000000);
      const newCards: Card[] = [];
      const cards: OldCard[] = data['cards'];
      const cardCategories: CardCategory[] = [];
      for (const card of cards) {
        if ('represents' in card && card.represents) {
          const logs: Log[] = [];
          const oldLogs: string[] =
            'logs' in card
              ? card.logs.split('\n').filter((str: string) => str !== '')
              : [];
          for (const oldLog of oldLogs) {
            const dateString: string | undefined = oldLog
              .split(']')[0]
              .split('[')[1];

            const timestamp: Date = dateString
              ? new Date(dateString)
              : originDate;
            const to: Status = oldLog.includes('banned')
              ? Status.Banned
              : Status.Allowed;
            logs.push({ timestamp: timestamp, to: to, from: Status.New });
          }
          const newCategory: CardCategory = {
            name: card.name,
            status: card.status == 'banned' ? Status.Banned : Status.Allowed,
            exampleCards: [card.name],
            comments: [
              { poster: 'Lav', timestamp: originDate, message: card.comments },
            ],
            markedForDiscussion: card.discuss,
            logs: logs,
          };
          cardCategories.push(newCategory);
        } else {
          const logs: Log[] = [];
          const oldLogs: string[] =
            'logs' in card
              ? card.logs.split('\n').filter((str: string) => str !== '')
              : [];
          for (const oldLog of oldLogs) {
            const dateString: string | undefined = oldLog
              .split(']')[0]
              .split('[')[1];

            const timestamp: Date = dateString
              ? new Date(dateString)
              : originDate;
            const to: Status = oldLog.includes('banned')
              ? Status.Banned
              : Status.Allowed;
            logs.push({ timestamp: timestamp, to: to, from: Status.New });
          }
          const newCard: Card = {
            name: card.name,
            status: card.status == 'banned' ? Status.Banned : Status.Allowed,
            releaseDate: originDate,
            comments: [
              { poster: 'Lav', timestamp: originDate, message: card.comments },
            ],
            logs: logs,
            markedForDiscussion: card.discuss,
          };
          newCards.push(newCard);
        }
      }
      return { cards: newCards, categories: cardCategories };
    }

    return { cards: data['cards'], categories: data['categories'] };
  } catch (error) {
    console.error('Error:', error);
    return { cards: [], categories: [] }; // Return an empty array in case of error
  }
}
