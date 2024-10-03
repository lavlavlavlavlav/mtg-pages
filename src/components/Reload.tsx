import { Button } from '@/components/ui/button';
import { loadCardsFromBucket } from '@/helpers';
import { useCallback } from 'react';

function Reload({ setCards }: { setCards: Function }) {
  const reload = useCallback(() => {
    console.log('Reloading cards ...');
    loadCardsFromBucket().then((c) => {
      setCards(c);
      console.log('Reloading cards done.');
    });
  }, [loadCardsFromBucket]);

  return (
    <Button
      className="absolute top-[50px] right-0 m-4 bg-orange-500 p-2 px-4 rounded-lg border-orange-500 text-white font-bold"
      variant="outline"
      onClick={reload}
    >
      Reload
    </Button>
  );
}

export default Reload;
