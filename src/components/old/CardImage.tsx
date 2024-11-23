//<img id="magicImage" class="magic-image" src="https://cards.scryfall.io/normal/front/9/9/995486ce-58bb-4753-a812-0ca73ef1a235.jpg?1562880052">

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

const imageCache = new Map<string, string | string[]>();

export function CardImage({
  cardName,
  preloadCards,
  onClickNext,
  onClickPrevious,
}: {
  cardName?: string;
  preloadCards?: string[];
  onClickNext?: Function;
  onClickPrevious?: Function;
}) {
  const [imageSrc, setImageSrc] = useState<string | string[]>('Forbid');
  const [frontSide, setFrontSide] = useState<boolean>(true);

  useEffect(() => {
    if (!cardName || cardName.length < 1) return;
    if (cardName && imageCache.has(cardName)) {
      // Überprüfe, ob das Bild schon im Cache ist
      setImageSrc(imageCache.get(cardName) || '');
      return;
    }

    let fetchURL =
      'https://api.scryfall.com/cards/named?exact=' +
      cardName +
      '&unique=cards';

    fetch(fetchURL)
      .then((response) => response.json())
      .then((data) => {
        if (cardName && 'image_uris' in data) {
          fetchURL = data['image_uris']['border_crop'];
          fetch(fetchURL)
            .then((response) => response.blob())
            .then((blob) => {
              const imageObjectURL = URL.createObjectURL(blob);
              imageCache.set(cardName, imageObjectURL);
              setFrontSide(true);
              setImageSrc(imageObjectURL);
            });
        } else if (cardName && 'card_faces' in data) {
          const cardFaces: string[] = [];
          fetchURL = data['card_faces'][0]['image_uris']['border_crop'];
          fetch(fetchURL)
            .then((response) => response.blob())
            .then((blob) => {
              const imageObjectURL = URL.createObjectURL(blob);
              cardFaces.push(imageObjectURL);
              fetchURL = data['card_faces'][1]['image_uris']['border_crop'];
              fetch(fetchURL)
                .then((response) => response.blob())
                .then((blob) => {
                  const imageObjectURL = URL.createObjectURL(blob);
                  cardFaces.push(imageObjectURL);
                  imageCache.set(cardName, cardFaces);
                  setFrontSide(true);
                  setImageSrc(cardFaces);
                });
            });
        } else {
          const defaultCardImage = 'An Incident Has Occurred';
          if (imageCache.has(defaultCardImage)) {
            setImageSrc(imageCache.get(defaultCardImage) || '');
            return;
          }
          fetchURL =
            'https://api.scryfall.com/cards/named?exact="' +
            defaultCardImage +
            '"&unique=cards';

          fetch(fetchURL)
            .then((response) => response.json())
            .then((data) => {
              fetchURL = data['image_uris']['border_crop'];
              fetch(fetchURL)
                .then((response) => response.blob())
                .then((blob) => {
                  const imageObjectURL = URL.createObjectURL(blob);
                  imageCache.set(defaultCardImage, imageObjectURL);
                  setFrontSide(true);
                  setImageSrc(imageObjectURL);
                });
            });
        }
      });
  }, [cardName]);

  useEffect(() => {
    preloadCards?.forEach((card) => {
      if (imageCache.has(card)) {
        return;
      }
      let fetchURL =
        'https://api.scryfall.com/cards/named?exact=' + card + '&unique=cards';

      fetch(fetchURL)
        .then((response) => response.json())
        .then((data) => {
          if ('image_uris' in data) {
            fetchURL = data['image_uris']['border_crop'];
            fetch(fetchURL)
              .then((response) => response.blob())
              .then((blob) => {
                const imageObjectURL = URL.createObjectURL(blob);
                imageCache.set(card, imageObjectURL);
              });
          } else if ('card_faces' in data) {
            const cardFaces: string[] = [];
            fetchURL = data['card_faces'][0]['image_uris']['border_crop'];
            fetch(fetchURL)
              .then((response) => response.blob())
              .then((blob) => {
                const imageObjectURL = URL.createObjectURL(blob);
                cardFaces.push(imageObjectURL);
                fetchURL = data['card_faces'][1]['image_uris']['border_crop'];
                fetch(fetchURL)
                  .then((response) => response.blob())
                  .then((blob) => {
                    const imageObjectURL = URL.createObjectURL(blob);
                    cardFaces.push(imageObjectURL);
                    imageCache.set(card, cardFaces);
                  });
              });
          }
        });
    });
  }, [preloadCards]);

  if (!cardName) return null;

  return (
    <div className="flex flex-col h-full w-full items-center mt-5">
      {Array.isArray(imageSrc) ? (
        <>
          {frontSide ? (
            <img className="max-w-full h-auto" src={imageSrc[0]}></img>
          ) : (
            <img className="max-w-full h-auto" src={imageSrc[1]}></img>
          )}
        </>
      ) : (
        <img className="max-w-full h-auto" src={imageSrc}></img>
      )}
      <div className="flex pr-5">
        {onClickPrevious ? (
          <Button
            className="m-4 mr-10 w-[75px] bg-orange-500 p-2 px-4 rounded-lg border-orange-500 text-white font-bold"
            variant="outline"
            onClick={() => onClickPrevious()}
          >
            Previous
          </Button>
        ) : null}
        {Array.isArray(imageSrc) ? (
          <Button
            className="m-4 w-[50px] bg-orange-500 p-2 px-4 rounded-lg border-orange-500 text-white font-bold"
            variant="outline"
            onClick={() => setFrontSide(!frontSide)}
          >
            Flip
          </Button>
        ) : (
          <div className="w-[82px]"></div>
        )}
        {onClickNext ? (
          <Button
            className="m-4 ml-10 w-[50px] bg-orange-500 p-2 px-4 rounded-lg border-orange-500 text-white font-bold"
            variant="outline"
            onClick={() => onClickNext()}
          >
            Next
          </Button>
        ) : null}
      </div>
    </div>
  );
}
