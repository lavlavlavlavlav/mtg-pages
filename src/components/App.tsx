import './App.css';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Card, CardCategory, Color, Role, Status } from '@/constants';
import { loadCardsFromBucket, saveCardsToBucket } from '@/helpers';
import { useCallback, useEffect, useState } from 'react';
import Login from './Login';
// import Reload from './Reload';
import { CustomSelect } from './CustomSelect';
import { ClickableList } from './ClickableList';
import { CardImage } from './CardImage';
import { Textarea } from '@/components/ui/textarea';
import LogTable from './LogTable';
import CommentTable from './CommentTable';
import { Button } from './ui/button';
import { Input } from '@/components/ui/input';
import EditCards from './EditCards';
import CheckCards from './CheckCards';
import AddCard from './AddCard';

enum FilterType {
  Alphabetical = 'Alphabetical',
  RecentlyChanged = 'RecentlyChanged',
  Status = 'Status',
}

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [categories, setCategories] = useState<CardCategory[]>([]);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(Role.Spectator);
  const [cardFilter, setCardFilter] = useState('Alphabetical');
  const [categoryFilter, setCategoryFilter] = useState('Alphabetical');
  const [commentMessage, setCommentMessage] = useState('');

  const [currentCard, setCurrentCard] = useState<Card>();
  const [currentCategoryName, setCurrentCategoryName] = useState<string>('');
  const [currentCategory, setCurrentCategory] = useState<CardCategory>();
  const [clickedCategory, setClickedCategory] = useState<boolean>(true);

  const [cardToShow, setCardToShow] = useState<string>('');
  const [preloadCardNames, setPreloadCardNames] = useState<string[]>([]);
  const [categoryCardIndex, setCategoryCardIndex] = useState<number>(0);

  const onClickNext = useCallback(() => {
    if (clickedCategory) {
      if (!currentCategory) return;
      const catIndex = categories.findIndex(
        (cat: CardCategory) => cat.name === currentCategory.name
      );
      if (catIndex + 1 < categories.length)
        setCurrentCategory(categories[catIndex + 1]);
    } else {
      if (!currentCard) return;
      const cardIndex = cards.findIndex(
        (card: Card) => card.name === currentCard.name
      );
      if (cardIndex + 1 < cards.length) setCurrentCard(cards[cardIndex + 1]);
    }
  }, [currentCard, currentCategory]);

  const onClickPrevious = useCallback(() => {
    if (clickedCategory) {
      if (!currentCategory) return;
      const catIndex = categories.findIndex(
        (cat: CardCategory) => cat.name === currentCategory.name
      );
      if (catIndex - 1 >= 0) setCurrentCategory(categories[catIndex - 1]);
    } else {
      if (!currentCard) return;
      const cardIndex = cards.findIndex(
        (card: Card) => card.name === currentCard.name
      );
      if (cardIndex - 1 >= 0) setCurrentCard(cards[cardIndex - 1]);
    }
  }, [currentCard, currentCategory]);

  useEffect(() => {
    if (!currentCard || clickedCategory) return;
    const cardIndex = cards.findIndex(
      (card: Card) => card.name === currentCard.name
    );
    const cardsToPreload = [];

    if (cardIndex + 1 < cards.length)
      cardsToPreload.push(cards[cardIndex + 1].name);

    if (cardIndex - 1 >= 0) cardsToPreload.push(cards[cardIndex - 1].name);

    setCardToShow(currentCard.name);
    setPreloadCardNames(cardsToPreload);
  }, [currentCard, clickedCategory]);

  useEffect(() => {
    if (!currentCategory || !clickedCategory) return;
    setCategoryCardIndex(0);
    setCardToShow(currentCategory.exampleCards[0]);

    const categoryIndex = categories.findIndex(
      (cat: CardCategory) => cat.name === currentCategory.name
    );
    const cardsToPreload = [...currentCategory.exampleCards];
    if (categoryIndex + 1 < categories.length)
      cardsToPreload.push(categories[categoryIndex + 1].exampleCards[0]);

    if (categoryIndex - 1 >= 0)
      cardsToPreload.push(categories[categoryIndex - 1].exampleCards[0]);
    setPreloadCardNames(cardsToPreload);
  }, [currentCategory, clickedCategory]);

  useEffect(() => {
    let sorted;
    switch (categoryFilter) {
      case FilterType.Alphabetical:
        sorted = [...categories].sort((a, b) => a.name.localeCompare(b.name));
        setCategories(sorted);
        break;
      case FilterType.RecentlyChanged:
        break;
      case FilterType.Status:
        sorted = [...categories].sort((a, b) =>
          a.status.localeCompare(b.status)
        );
        setCategories(sorted);
        break;
      default:
        console.log('Unknown filter type: ' + categoryFilter);
    }
  }, [categoryFilter]);

  useEffect(() => {
    let sorted;
    switch (cardFilter) {
      case FilterType.Alphabetical:
        sorted = [...cards].sort((a, b) => a.name.localeCompare(b.name));
        setCards(sorted);
        break;
      case FilterType.RecentlyChanged:
        break;
      case FilterType.Status:
        sorted = [...cards].sort((a, b) => a.status.localeCompare(b.status));
        setCards(sorted);
        break;
      default:
        console.log('Unknown filter type: ' + categoryFilter);
    }
  }, [cardFilter]);

  useEffect(() => {
    if (!currentCard) return;
    const updatedCards = [...cards];
    updatedCards[
      cards.findIndex((card: Card) => card.name === currentCard.name)
    ] = currentCard;
    setCards(updatedCards);
  }, [currentCard]);

  useEffect(() => {
    if (!currentCategory) return;
    setCurrentCategoryName(currentCategory.name);
    const updatedCategories = [...categories];
    updatedCategories[
      categories.findIndex((cat: CardCategory) => cat.id === currentCategory.id)
    ] = currentCategory;
    setCategories(updatedCategories);
  }, [currentCategory, currentCategoryName]);

  useEffect(() => {
    loadCardsFromBucket().then((response) => {
      setCards(response.cards);
      setCategories(response.categories);
      setCurrentCategory(response.categories[0]);
    });
  }, []);

  const deleteLog = useCallback(
    (timestamp: Date) => {
      if (clickedCategory) {
        if (!currentCategory) return;
        const catWithNewLog = { ...currentCategory };
        catWithNewLog.logs = catWithNewLog.logs.filter(
          (log) => log.timestamp !== timestamp
        );
        setCurrentCategory(catWithNewLog);
      } else {
        if (!currentCard) return;
        const cardWithNewLog = { ...currentCard };
        cardWithNewLog.logs = cardWithNewLog.logs.filter(
          (log) => log.timestamp !== timestamp
        );
        setCurrentCard(cardWithNewLog);
      }
    },
    [currentCard?.logs, currentCategory?.logs]
  );

  const deleteComment = useCallback(
    (timestamp: Date) => {
      if (clickedCategory) {
        if (!currentCategory) return;
        const catWithNewComment = { ...currentCategory };
        catWithNewComment.comments = catWithNewComment.comments.filter(
          (comment) => comment.timestamp !== timestamp
        );
        setCurrentCategory(catWithNewComment);
      } else {
        if (!currentCard) return;
        const cardWithNewComment = { ...currentCard };
        cardWithNewComment.comments = cardWithNewComment.comments.filter(
          (comment) => comment.timestamp !== timestamp
        );
        setCurrentCard(cardWithNewComment);
      }
    },
    [currentCard, currentCategory, clickedCategory]
  );

  const createComment = useCallback(
    (message: string) => {
      if (clickedCategory) {
        if (!currentCategory || message.length > 200 || message.length < 1)
          return;
        const catWithNewComment = { ...currentCategory };

        catWithNewComment.comments.push({
          timestamp: new Date(),
          poster: username,
          message: message,
        });
        setCurrentCategory(catWithNewComment);
      } else {
        if (!currentCard || message.length > 200 || message.length < 1) return;
        const cardWithNewComment = { ...currentCard };

        cardWithNewComment.comments.push({
          timestamp: new Date(),
          poster: username,
          message: message,
        });
        setCurrentCard(cardWithNewComment);
      }
    },
    [currentCard, username, clickedCategory, currentCategory]
  );

  const onToggleBanned = useCallback(() => {
    if (!clickedCategory) {
      if (!currentCard || role != Role.Admin) return;
      const newCard = { ...currentCard };
      newCard.status =
        currentCard.status == Status.Banned ? Status.Allowed : Status.Banned;
      newCard.logs.push({
        timestamp: new Date(),
        user: username,
        from: currentCard.status,
        to: newCard.status,
      });
      setCurrentCard(newCard);
    } else {
      if (!currentCategory || role != Role.Admin) return;
      const newCategory = { ...currentCategory };
      newCategory.status =
        currentCategory.status == Status.Banned
          ? Status.Allowed
          : Status.Banned;
      newCategory.logs.push({
        timestamp: new Date(),
        user: username,
        from: newCategory.status,
        to: newCategory.status,
      });
      setCurrentCategory(newCategory);
    }
  }, [currentCard, currentCategory, role]);

  const onToggleDiscuss = useCallback(() => {
    if (!clickedCategory) {
      if (!currentCard) return;
      const newCard = { ...currentCard };
      newCard.markedForDiscussion = !currentCard.markedForDiscussion;
      setCurrentCard(newCard);
    } else {
      if (!currentCategory) return;
      const newCategory = { ...currentCategory };
      newCategory.markedForDiscussion = !newCategory.markedForDiscussion;
      setCurrentCategory(newCategory);
    }
  }, [currentCard, currentCategory, role]);

  const onEditCategoryCards = useCallback(
    (stringArray: string[]) => {
      if (!currentCategory) return;
      const catWithNewCards = { ...currentCategory };

      catWithNewCards.exampleCards = stringArray;
      setCurrentCategory(catWithNewCards);
      setCategoryCardIndex(0);
    },
    [currentCard, currentCategory]
  );

  const onAddCard = useCallback(
    (cardname: string) => {
      if (!cardname || !cards) return;
      const newCards: Card[] = [...cards];

      newCards.push({
        name: cardname,
        status: Status.Allowed,
        markedForDiscussion: true,
        comments: [],
        logs: [],
      });
      setCards(newCards);
      setCurrentCard(newCards[newCards.length - 1]);
    },
    [cards]
  );

  const onDeleteCategory = useCallback(() => {
    if (!currentCategory) return;
    let newCategories = [...categories];

    newCategories = newCategories.filter((cat) => cat.id != currentCategory.id);
    setCategories(newCategories);
    setCategoryCardIndex(0);
    setCurrentCategory(newCategories[0]);
  }, [categories, currentCategory]);

  const onDeleteCard = useCallback(() => {
    if (!currentCard) return;
    let newCards = [...cards];

    newCards = newCards.filter((card) => card.name != currentCard.name);
    setCards(newCards);
    setCurrentCard(newCards[0]);
  }, [cards, currentCard]);

  const onAddCategory = useCallback(() => {
    let newCategories = [...categories];

    const newIDs = newCategories.map((cat) => cat.id);
    let newID = 1; // Start checking from id 1
    while (newIDs.includes(newID)) {
      newID++;
    }

    newCategories.push({
      id: newID,
      name: 'new Category',
      markedForDiscussion: true,
      comments: [],
      exampleCards: [],
      logs: [],
      status: Status.Allowed,
    });
    setCategories(newCategories);
    setCategoryCardIndex(0);
    setCurrentCategory(newCategories[newCategories.length - 1]);
  }, [categories, currentCategory]);

  if (cards.length == 0) return null;

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
        className="absolute top-[60px] right-0 m-4 bg-orange-500 p-2 px-4 rounded-lg border-orange-500 text-white font-bold"
        onClick={() => {
          const url = URL.createObjectURL(
            new Blob(
              [JSON.stringify({ cards: cards, categories: categories })],
              { type: 'application/json' }
            )
          );
          const a = document.createElement('a');
          a.href = url;
          a.download = 'cards.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }}
      >
        Download
      </Button>
      <Button
        className="absolute top-[120px] right-0 m-4 bg-orange-500 p-2 px-4 rounded-lg border-orange-500 text-white font-bold"
        onClick={() => {
          saveCardsToBucket({ cards: cards, categories: categories });
        }}
        disabled={username ? false : true}
      >
        Save Changes
      </Button>
      <Button
        className="absolute top-[240px] right-0 m-4 bg-orange-500 p-2 px-4 rounded-lg border-orange-500 text-white font-bold"
        variant="outline"
        disabled={role != Role.Admin}
        onClick={() => {
          onAddCategory();
        }}
      >
        {'Create Category'}
      </Button>
      <AddCard
        cards={cards}
        disabled={role != Role.Admin && role != Role.Manager}
        onAdd={onAddCard}
      ></AddCard>
      <CheckCards cards={cards} categories={categories}></CheckCards>
      {/* <Reload setCards={setCards}></Reload> */}
      <div className="h-screen w-full overflow-hidden bg-zinc-900 text-white font-bold">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={15}>
            <div className="flex h-full items-center justify-center">
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={30}>
                  <div className="flex flex-col h-full w-full items-center pt-2">
                    <CustomSelect
                      onChange={(newFilter) => setCategoryFilter(newFilter)}
                      options={[FilterType.Alphabetical, FilterType.Status]}
                      placeholder="Sort by"
                      defaultOption={categoryFilter}
                    ></CustomSelect>
                    <ClickableList
                      listEntries={categories.map((cat) => ({
                        title: cat.name,
                        onClick: () => {
                          setCurrentCategory(cat);
                          setClickedCategory(true);
                        },
                        color: cat.markedForDiscussion
                          ? Color.UndecidedYellow
                          : cat.status == Status.Banned
                            ? Color.BannedRed
                            : cat.status == Status.Allowed
                              ? Color.AllowedGreen
                              : Color.UndecidedYellow,
                      }))}
                    ></ClickableList>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                  <div className="flex flex-col h-full w-full items-center pt-2">
                    <CustomSelect
                      onChange={(newFilter) => setCardFilter(newFilter)}
                      options={[FilterType.Alphabetical, FilterType.Status]}
                      placeholder="Sort by"
                      defaultOption={cardFilter}
                    ></CustomSelect>
                    <ClickableList
                      listEntries={cards.map((card) => ({
                        title: card.name,
                        onClick: () => {
                          setCurrentCard(card);
                          setClickedCategory(false);
                        },
                        color: card.markedForDiscussion
                          ? Color.UndecidedYellow
                          : card.status == Status.Banned
                            ? Color.BannedRed
                            : card.status == Status.Allowed
                              ? Color.AllowedGreen
                              : Color.UndecidedYellow,
                      }))}
                    ></ClickableList>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={85}>
            <div className="flex h-full">
              <div className="flex flex-col h-full w-[1600px]">
                <div className="flex ml-5">
                  {currentCard || currentCategory ? (
                    <CardImage
                      cardName={cardToShow}
                      preloadCards={preloadCardNames}
                      onClickNext={onClickNext}
                      onClickPrevious={onClickPrevious}
                    ></CardImage>
                  ) : null}
                  <div className="flex flex-col h-full w-full items-start pt-2 pl-10 pt-20 ">
                    {clickedCategory ? (
                      <>
                        <div className="flex">
                          <span className="font-bold underline w-[70px] inline-block">
                            Name:
                          </span>
                          {role != Role.Admin ? (
                            <span
                              className={
                                currentCategory?.markedForDiscussion
                                  ? '[color:' + Color.UndecidedYellow + ']'
                                  : currentCategory?.status == Status.Banned
                                    ? '[color:' + Color.BannedRed + ']'
                                    : '[color:' + Color.AllowedGreen + ']'
                              }
                            >
                              {currentCategory?.name}
                            </span>
                          ) : (
                            <Input
                              className="w-full h-full"
                              value={currentCategoryName}
                              onChange={(e) => {
                                if (!currentCategory) return;
                                const newCategory = { ...currentCategory };
                                newCategory.name = e.target.value;
                                setCurrentCategory(newCategory);
                              }}
                            ></Input>
                          )}
                        </div>
                        <div>
                          <span className="font-bold underline w-[70px] inline-block">
                            Status:
                          </span>
                          <span
                            className={
                              currentCategory?.markedForDiscussion
                                ? '[color:' + Color.UndecidedYellow + ']'
                                : currentCategory?.status == Status.Banned
                                  ? '[color:' + Color.BannedRed + ']'
                                  : '[color:' + Color.AllowedGreen + ']'
                            }
                          >
                            {currentCategory?.status}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold underline w-[70px] inline-block">
                            Discuss:
                          </span>
                          <span
                            className={
                              currentCategory?.markedForDiscussion
                                ? '[color:' + Color.UndecidedYellow + ']'
                                : currentCategory?.status == Status.Banned
                                  ? '[color:' + Color.BannedRed + ']'
                                  : '[color:' + Color.AllowedGreen + ']'
                            }
                          >
                            {currentCategory?.markedForDiscussion
                              ? 'True'
                              : 'False'}
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Button
                            className={
                              'p-2 px-4 mt-40 rounded-lg text-white font-bold bg-orange-500 border-orange-500'
                            }
                            variant="outline"
                            disabled={role != Role.Admin}
                            onClick={() => {
                              onToggleBanned();
                            }}
                          >
                            Toggle Banned
                          </Button>
                          <Button
                            className="p-2 px-4 rounded-lg text-white font-bold bg-orange-500 border-orange-500 mt-5"
                            variant="outline"
                            disabled={
                              role != Role.Admin && role != Role.Manager
                            }
                            onClick={() => {
                              onToggleDiscuss();
                            }}
                          >
                            Toggle Discuss
                          </Button>
                          <div className="flex">
                            <Button
                              className="p-1 px-4 rounded-lg text-white font-bold bg-orange-500 border-orange-500 mt-5"
                              variant="outline"
                              disabled={categoryCardIndex - 1 < 0}
                              onClick={() => {
                                if (!currentCategory) return;
                                setCategoryCardIndex(
                                  categoryCardIndex - 1 >= 0
                                    ? categoryCardIndex - 1
                                    : categoryCardIndex
                                );
                                setCardToShow(
                                  currentCategory.exampleCards[
                                    categoryCardIndex - 1 >= 0
                                      ? categoryCardIndex - 1
                                      : categoryCardIndex
                                  ]
                                );
                              }}
                            >
                              {'<'}
                            </Button>
                            <EditCards
                              cards={currentCategory?.exampleCards}
                              onClose={(e: string[]) => {
                                onEditCategoryCards(e);
                              }}
                              disabled={
                                role != Role.Admin && role != Role.Manager
                              }
                            ></EditCards>
                            <Button
                              className="p-1 px-4 rounded-lg text-white font-bold bg-orange-500 border-orange-500 mt-5"
                              variant="outline"
                              disabled={
                                !currentCategory
                                  ? true
                                  : categoryCardIndex + 1 >=
                                    currentCategory.exampleCards.length
                              }
                              onClick={() => {
                                if (!currentCategory) return;
                                setCategoryCardIndex(
                                  categoryCardIndex + 1 <
                                    currentCategory.exampleCards.length
                                    ? categoryCardIndex + 1
                                    : categoryCardIndex
                                );
                                setCardToShow(
                                  currentCategory.exampleCards[
                                    categoryCardIndex + 1 <
                                    currentCategory.exampleCards.length
                                      ? categoryCardIndex + 1
                                      : categoryCardIndex
                                  ]
                                );
                              }}
                            >
                              {'>'}
                            </Button>
                          </div>
                          <Button
                            className="p-1 px-4 rounded-lg text-white font-bold bg-orange-500 border-orange-500 mt-5"
                            variant="outline"
                            disabled={role != Role.Admin}
                            onClick={() => {
                              onDeleteCategory();
                            }}
                          >
                            {'Delete Category'}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="font-bold underline w-[70px] inline-block">
                            Name:{' '}
                          </span>
                          <span
                            className={
                              currentCard?.markedForDiscussion
                                ? '[color:' + Color.UndecidedYellow + ']'
                                : currentCard?.status == Status.Banned
                                  ? '[color:' + Color.BannedRed + ']'
                                  : '[color:' + Color.AllowedGreen + ']'
                            }
                          >
                            {currentCard?.name}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold underline w-[70px] inline-block">
                            Status:{' '}
                          </span>
                          <span
                            className={
                              currentCard?.markedForDiscussion
                                ? '[color:' + Color.UndecidedYellow + ']'
                                : currentCard?.status == Status.Banned
                                  ? '[color:' + Color.BannedRed + ']'
                                  : '[color:' + Color.AllowedGreen + ']'
                            }
                          >
                            {currentCard?.status}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold underline w-[70px] inline-block">
                            Discuss:{' '}
                          </span>
                          <span
                            className={
                              currentCard?.markedForDiscussion
                                ? '[color:' + Color.UndecidedYellow + ']'
                                : currentCard?.status == Status.Banned
                                  ? '[color:' + Color.BannedRed + ']'
                                  : '[color:' + Color.AllowedGreen + ']'
                            }
                          >
                            {currentCard?.markedForDiscussion
                              ? 'True'
                              : 'False'}
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Button
                            className={
                              'p-2 px-4 mt-40 rounded-lg text-white font-bold bg-orange-500 border-orange-500'
                            }
                            variant="outline"
                            disabled={role != Role.Admin}
                            onClick={() => {
                              onToggleBanned();
                            }}
                          >
                            Toggle Banned
                          </Button>
                          <Button
                            className="p-2 px-4 rounded-lg text-white font-bold bg-orange-500 border-orange-500 mt-5"
                            variant="outline"
                            disabled={
                              role != Role.Admin && role != Role.Manager
                            }
                            onClick={() => {
                              onToggleDiscuss();
                            }}
                          >
                            Toggle Discuss
                          </Button>
                          <Button
                            className="p-1 px-4 rounded-lg text-white font-bold bg-orange-500 border-orange-500 mt-5"
                            variant="outline"
                            disabled={role != Role.Admin}
                            onClick={() => {
                              onDeleteCard();
                            }}
                          >
                            {'Delete Card'}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="overflow-y-auto overflow-x-hidden h-full ml-5">
                  <span>Log</span>
                  <LogTable
                    entries={
                      clickedCategory
                        ? currentCategory?.logs
                        : currentCard?.logs
                    }
                    deleteFunction={deleteLog}
                    userRole={role}
                  />
                </div>
              </div>
              <div className="flex items-end w-full m-5 mt-30">
                <div className="w-full">
                  <div className="w-full max-h-[450px] overflow-y-scroll">
                    <CommentTable
                      entries={
                        clickedCategory
                          ? currentCategory?.comments
                          : currentCard?.comments
                      }
                      deleteFunction={deleteComment}
                      userRole={role}
                    />
                  </div>
                  <div className="grid w-full gap-2">
                    <Textarea
                      value={commentMessage}
                      onChange={(e) => setCommentMessage(e.target.value)}
                      placeholder="Type your message here."
                    />
                    <Button
                      className="bg-orange-500 p-2 px-4 rounded-lg border-orange-500 text-white font-bold"
                      variant="outline"
                      disabled={!username}
                      onClick={() => {
                        setCommentMessage('');
                        createComment(commentMessage);
                      }}
                    >
                      Send message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}

export default App;
