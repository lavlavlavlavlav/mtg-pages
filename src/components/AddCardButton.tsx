import { Button } from '@/components/ui/button';
import { Status } from '@/constants';
import {
  fetchBannedCardsAndCategories,
  saveBannedCardsAndCategories,
} from '@/helpers';
import { Action, ACTIONS, State } from '@/reducer';
import { Dispatch, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

function AddCardButton({
  state,
  dispatch,
  disabled,
}: {
  state: State;
  dispatch: Dispatch<Action>;
  disabled: boolean;
}) {
  const onClick = useCallback(() => {
    if (disabled) return;
    fetchBannedCardsAndCategories(dispatch).then(() => {
      dispatch({
        type: ACTIONS.ADDCARD,
        payload: {
          card: {
            id: uuidv4(),
            name: 'Aluren',
            status: Status.Allowed,
            comments: [],
            logs: [],
            markedForDiscussion: true,
          },
        },
      });
    });
  }, [state, dispatch, disabled]);

  return (
    <>
      <Button
        className=""
        variant="outline"
        disabled={disabled}
        onClick={onClick}
      >
        Add Card
      </Button>
    </>
  );
}

export default AddCardButton;
