import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardCategory, Status } from '@/constants';
import { useCallback, useState } from 'react';

function CheckCards({
  cards,
  categories,
}: {
  cards: Card[];
  categories: CardCategory[];
}) {
  const [cardsString, setCardsString] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const onClickCheckCards = useCallback(
    (cardsToCheck: string) => {
      if (!cards || !categories) return;
      let cardsToCheckArray: string[] = cardsToCheck
        .split('\n')
        .filter(
          (name) =>
            !name.toLocaleLowerCase().includes('sideboard') &&
            !name.toLocaleLowerCase().includes('mainboard') &&
            !name.toLocaleLowerCase().includes('maybeboard')
        );
      cardsToCheckArray = cardsToCheckArray.map((line) => {
        if (!line) {
          return '';
        }
        if (!isNaN(parseInt(line.charAt(0)))) {
          let nameParts: string[] = line.split(' ');
          nameParts = nameParts.splice(1);
          return nameParts.join(' ').toLocaleLowerCase();
        }
        return line.toLocaleLowerCase();
      });

      let bannedCards: string[] = [];
      cards.forEach((card) => {
        if (card.status == Status.Banned)
          bannedCards.push(card.name.toLocaleLowerCase());
      });
      categories.forEach((cat) => {
        if (cat.status == Status.Banned) {
          cat.exampleCards.forEach((card) => {
            bannedCards.push(card);
          });
        }
      });

      bannedCards = bannedCards.filter((str) => str !== '');
      cardsToCheckArray = cardsToCheckArray.filter((str) => str !== '');

      const alerts: string[] = [];
      cardsToCheckArray.forEach((card) => {
        bannedCards.forEach((bannedCard) => {
          if (bannedCard.includes(card)) {
            alerts.push(card + ' is banned');
          }
        });
      });

      if (alerts.length > 0) {
        alert(alerts.join('\n'));
      } else {
        alert('No banned cards :)');
      }
    },
    [cards, categories]
  );

  return (
    <Popover open={dialogOpen} onOpenChange={setDialogOpen}>
      <PopoverTrigger asChild>
        <Button
          className="absolute top-[180px] right-0 m-4 bg-orange-500 p-2 px-4 rounded-lg border-orange-500 text-white font-bold"
          variant="outline"
        >
          Check Cards
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
              onClickCheckCards(cardsString);
              setDialogOpen(false);
            }}
          >
            Check
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default CheckCards;
