import './App.css';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { BUCKET_URL, Color, Role } from '@/constants';
import { useCallback, useEffect, useState } from 'react';
import Login from './Login';
import { ClickableList } from './ClickableList';
import { CardImage } from './CardImage';
import { Button } from './ui/button';
import AddCard from './AddCard';
import { useNavigate } from 'react-router-dom';

export interface CoolCard {
  name: string;
  poster: string;
  color: Color;
}

async function loadCardsFromBucket() {
  try {
    const response = await fetch(BUCKET_URL + '/coolcarddata');
    const data = await response.json();
    return data['coolcards'];
  } catch (e) {
    console.log('Failed to fetch cool cards.');
  }
}

async function saveCardsToBucket(cards: CoolCard[]) {
  const response = await fetch(BUCKET_URL + '/coolcarddata', {
    method: 'POST',
    body: JSON.stringify({ coolcards: cards }),
  });
  if (response.status == 200) {
    alert('Success');
  } else {
    console.log('Error while saving - response:');
    console.log(JSON.stringify(response));
  }
}

function CoolCards() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(Role.Spectator);
  const [cards, setCards] = useState<CoolCard[]>([]);
  const [currentCard, setCurrentCard] = useState<CoolCard>();

  useEffect(() => {
    loadCardsFromBucket().then((c) => {
      setCards(c);
      setCurrentCard(c[0]);
    });
  }, []);

  useEffect(() => {
    if (!currentCard) return;
    const updatedCards = [...cards];
    updatedCards[
      cards.findIndex((card: CoolCard) => card.name === currentCard.name)
    ] = currentCard;
    setCards(updatedCards);
  }, [currentCard]);

  const onClickNext = useCallback(() => {
    if (!currentCard) return;
    const cardIndex = cards.findIndex(
      (card: CoolCard) => card.name === currentCard.name
    );
    if (cardIndex + 1 < cards.length) setCurrentCard(cards[cardIndex + 1]);
  }, [currentCard]);

  const onClickPrevious = useCallback(() => {
    if (!currentCard) return;
    const cardIndex = cards.findIndex(
      (card: CoolCard) => card.name === currentCard.name
    );
    if (cardIndex - 1 >= 0) setCurrentCard(cards[cardIndex - 1]);
  }, [currentCard]);

  const onAddCard = useCallback(
    (cardname: string) => {
      if (!cardname || !cards) return;
      const newCards: CoolCard[] = [...cards];

      newCards.push({
        name: cardname,
        poster: username,
        color: Color.White,
      });
      setCards(newCards);
      setCurrentCard(newCards[newCards.length - 1]);
    },
    [cards]
  );

  const setColor = useCallback(
    (color: Color) => {
      if (!currentCard) return;
      const newCard: CoolCard = { ...currentCard };
      newCard.color = color;
      setCurrentCard(newCard);
    },
    [currentCard]
  );

  const deleteCurrentCard = useCallback(() => {
    if (!currentCard) return;
    let newCards: CoolCard[] = [...cards];
    newCards = newCards.filter((card) => card.name != currentCard.name);
    setCards(newCards);
    setCurrentCard(newCards[newCards.length - 1]);
  }, [currentCard]);

  const navigate = useNavigate();

  if (!cards) return null;

  return (
    <>
      <span className="absolute text-white font-bold absolute top-6 right-[350px]">
        User: {username}
      </span>
      <span className="absolute text-white font-bold absolute top-6 right-[150px]">
        Role: {role}
      </span>
      <Login setRole={setRole} setUser={setUsername}></Login>
      <Button
        className="absolute top-[120px] right-0 m-4 bg-orange-500 p-2 px-4 rounded-lg border-orange-500 text-white font-bold"
        onClick={() => {
          saveCardsToBucket(cards);
        }}
        disabled={username ? false : true}
      >
        Save Changes
      </Button>
      <Button
        className="absolute top-[240px] right-0 m-4 bg-orange-500 p-2 px-4 rounded-lg border-orange-500 text-white font-bold"
        onClick={() => {
          deleteCurrentCard();
        }}
        disabled={role != Role.Admin && role != Role.Manager}
      >
        Delete Card
      </Button>
      <AddCard
        cards={cards}
        disabled={role != Role.Admin && role != Role.Manager}
        onAdd={onAddCard}
      ></AddCard>
      <Button
        className="absolute top-[360px] right-0 m-4 bg-orange-500 p-2 px-4 rounded-lg border-orange-500 text-white font-bold"
        onClick={() => navigate('/mtg-pages')}
        disabled={false}
      >
        Card Ban Tool
      </Button>
      <div className="h-screen w-full overflow-hidden bg-zinc-900 text-white font-bold">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={15}>
            <div className="flex h-full items-center justify-center">
              <ClickableList
                listEntries={cards.map((card) => ({
                  title: card.name,
                  onClick: () => {
                    setCurrentCard(card);
                  },
                  color: card.color,
                }))}
              ></ClickableList>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={85}>
            <div className="flex">
              <div className="w-[600px] ml-5">
                {currentCard ? (
                  <CardImage
                    cardName={currentCard.name}
                    preloadCards={[]}
                    onClickNext={onClickNext}
                    onClickPrevious={onClickPrevious}
                  ></CardImage>
                ) : null}
              </div>
              <div className="w-full mt-20 flex flex-col">
                <span className="ml-5">Poster: {currentCard?.poster}</span>
                <Button
                  className="w-[100px] m-4 bg-orange-500 p-2 px-4 rounded-lg border-orange-500 text-white font-bold"
                  onClick={() => {
                    setColor(Color.AllowedGreen);
                  }}
                  disabled={username ? false : true}
                >
                  Set Staple
                </Button>
                <Button
                  className="w-[100px] m-4 bg-orange-500 p-2 px-4 rounded-lg border-orange-500 text-white font-bold"
                  onClick={() => {
                    setColor(Color.White);
                  }}
                  disabled={username ? false : true}
                >
                  Set Normal
                </Button>
                <Button
                  className="w-[100px] m-4 bg-orange-500 p-2 px-4 rounded-lg border-orange-500 text-white font-bold"
                  onClick={() => {
                    setColor(Color.BannedRed);
                  }}
                  disabled={username ? false : true}
                >
                  Set Niche
                </Button>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}

export default CoolCards;
