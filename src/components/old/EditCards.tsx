import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';

function EditCards({
  cards,
  onClose,
  disabled,
}: {
  cards: string[] | undefined;
  onClose: Function;
  disabled: boolean;
}) {
  const [cardsString, setCardsString] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!cards) return;
    setCardsString(cards.map((item) => `"${item}"`).join(', '));
  }, [cards]);

  return (
    <Popover open={dialogOpen} onOpenChange={setDialogOpen}>
      <PopoverTrigger asChild>
        <Button
          className="p-1 px-4 rounded-lg text-white font-bold bg-orange-500 border-orange-500 mt-5 ml-2 mr-2"
          variant="outline"
          disabled={disabled}
        >
          Edit Cards
        </Button>
      </PopoverTrigger>
      <PopoverContent className="absolute -top-10 -right-10 w-80 bg-zinc-700 text-white font-bold w-[500px] h-[230px]">
        <div className="flex flex-col items-center">
          <Textarea
            className="w-full h-[150px]"
            value={cardsString}
            onChange={(e) => setCardsString(e.target.value)}
          />
          <Button
            className="m-3 ml-[100px] bg-orange-500 text-white p-2 px-4 rounded-lg border-orange-500 font-bold"
            variant="outline"
            onClick={() => {
              if (!cardsString) return;
              try {
                onClose(
                  // @ts-ignore
                  cardsString
                    .match(/"(.*?)"/g)
                    .map((item: string) => item.replace(/"/g, ''))
                );
                setDialogOpen(false);
              } catch {}
            }}
          >
            Confirm
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default EditCards;
