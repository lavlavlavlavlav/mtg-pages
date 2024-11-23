import { Card, CardCategory, Category } from './constants';

export enum ACTIONS {
  SETCARDS = 'SETCARDS',
  SETCATEGORIES = 'SETCATEGORIES',
  ADDCARD = 'ADDCARD',
  SETSAVED = 'SETSAVED',
}

export interface State {
  cards: Card[];
  categories: Category[];
  needsSaving: boolean;
}

export interface Action {
  type: ACTIONS;
  payload?: any;
}

export const initialState: State = {
  cards: [],
  categories: [],
  needsSaving: false,
};

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTIONS.SETCARDS:
      if (!action.payload.cards) {
        console.log('Failed to set cards - action:');
        console.log(JSON.stringify(action));
        return state;
      }
      console.log('SETCARDS');
      return {
        ...state,
        cards: action.payload.cards.sort((a: Card, b: Card) =>
          a.name.localeCompare(b.name)
        ),
      };
    case ACTIONS.SETCATEGORIES:
      if (!action.payload.categories) {
        console.log('Failed to add categories - action:');
        console.log(JSON.stringify(action));
        return state;
      }
      return {
        ...state,
        categories: action.payload.categories.sort((a: Category, b: Category) =>
          a.name.localeCompare(b.name)
        ),
      };
    case ACTIONS.SETSAVED:
      return {
        ...state,
        needsSaving: false,
      };
    case ACTIONS.ADDCARD:
      if (!action.payload.card) {
        console.log('Failed to add cards - action:');
        console.log(JSON.stringify(action));
        return state;
      }
      console.log('ADDCARD');
      const newCards: Card[] = [...state.cards, action.payload.card].sort(
        (a: Card, b: Card) => a.name.localeCompare(b.name)
      );
      return {
        ...state,
        cards: newCards,
        needsSaving: true,
      };
    default:
      return state;
  }
};
