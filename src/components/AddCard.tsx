import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card } from '@/constants';
import { useCallback, useState } from 'react';
import { CoolCard } from './CoolCards';

function AddCard({
  cards,
  onAdd,
  disabled,
}: {
  cards: Card[] | CoolCard[] | undefined;
  onAdd: Function;
  disabled: boolean;
}) {
  const [cardString, setCardString] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const onSubmit = useCallback(() => {
    if (!cardString || !cards) return;

    let duplicate = false;
    cards.forEach((card) => {
      if (card.name == cardString) duplicate = true;
    });
    if (!duplicate) {
      onAdd(cardString);
      setDialogOpen(false);
    }
  }, [cardString, cards, onAdd]);

  return (
    <Popover open={dialogOpen} onOpenChange={setDialogOpen}>
      <PopoverTrigger asChild>
        <Button
          className="absolute top-[300px] right-0 m-4 bg-orange-500 p-2 px-4 rounded-lg border-orange-500 text-white font-bold"
          variant="outline"
          disabled={disabled}
        >
          Add Card
        </Button>
      </PopoverTrigger>
      <PopoverContent className="absolute -top-10 -right-10 w-80 bg-zinc-700 text-white font-bold w-[200px] h-[130px]">
        <div className="flex flex-col">
          <div className="flex items-center">
            <Label className="text-white font-bold" htmlFor="maxWidth">
              Card Name:
            </Label>
            <Input
              className="col-span-2 h-8"
              value={cardString}
              onChange={(e) => setCardString(e.target.value)}
              onKeyDown={(e) => {
                if (!cardString) return;
                if (e.key === 'Enter') {
                  onSubmit();
                }
              }}
            />
          </div>
          <Button
            className="m-3 w-[100px] bg-orange-500 text-white p-2 px-4 rounded-lg border-orange-500 font-bold"
            variant="outline"
            onClick={() => {
              if (!cardString) return;
              onSubmit();
            }}
          >
            Add
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default AddCard;
