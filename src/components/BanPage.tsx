import {
  fetchBannedCardsAndCategories,
  saveBannedCardsAndCategories,
} from '@/helpers';
import { Action, ACTIONS, initialState, reducer, State } from '@/reducer';
import { Dispatch, useEffect, useReducer } from 'react';
import { Button } from './ui/button';
import { Status } from '@/constants';
import { v4 as uuidv4 } from 'uuid';
import AddCardButton from './AddCardButton';

function BanPage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchBannedCardsAndCategories(dispatch).then((success: boolean) => {
      if (!success) {
        alert('Failed to fetch banned cards and categories.');
      }
    });
  }, []);

  useEffect(() => {
    if (!state.needsSaving) return;
    console.log('saving changes to data ...');
    saveBannedCardsAndCategories(state, dispatch);
  }, [state.needsSaving]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log('saving...');
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <>
      <div>{JSON.stringify(state.cards)}</div>
      <div>{JSON.stringify(state.categories)}</div>
      <AddCardButton state={state} dispatch={dispatch} disabled={false} />
    </>
  );
}

export default BanPage;
