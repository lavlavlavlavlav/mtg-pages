import './App.css';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Card, CardCategory, Color, Role, Status } from '@/constants';
import { loadCardsFromBucket } from '@/helpers';
import { useEffect, useState } from 'react';
import Login from './Login';
import Reload from './Reload';
import { CustomSelect } from './CustomSelect';
import { ClickableList, ListEntry } from './ClickableList';

enum FilterType {
  Alphabetical = 'Alphabetical',
  RecentlyChanged = 'RecentlyChanged',
  Status = 'Status',
}

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [categories, setCategories] = useState<CardCategory[]>([]);
  const [role, setRole] = useState(Role.Spectator);
  const [cardFilter, setCardFilter] = useState('Alphabetical');
  const [categoryFilter, setCategoryFilter] = useState('Alphabetical');

  const [currentCard, setCurrentCard] = useState<Card>();
  const [currentCategory, setCurrentCategory] = useState<CardCategory>();

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
    loadCardsFromBucket().then((response) => {
      setCards(response.cards);
      setCategories(response.categories);
      setCurrentCategory(response.categories[0]);
    });
  }, []);

  if (cards.length == 0) return null;

  return (
    <>
      <span className="text-white font-bold absolute top-6 right-[150px]">
        Role: {role}
      </span>
      <Login setRole={setRole}></Login>
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
                      options={[
                        FilterType.Alphabetical,
                        FilterType.RecentlyChanged,
                        FilterType.Status,
                      ]}
                      placeholder="Sort by"
                      defaultOption={categoryFilter}
                    ></CustomSelect>
                    <ClickableList
                      listEntries={categories.map((cat) => ({
                        title: cat.name,
                        onClick: () => setCurrentCategory(cat),
                        color:
                          cat.status == Status.Banned
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
                      options={[
                        FilterType.Alphabetical,
                        FilterType.RecentlyChanged,
                        FilterType.Status,
                      ]}
                      placeholder="Sort by"
                      defaultOption={cardFilter}
                    ></CustomSelect>
                    <ClickableList
                      listEntries={cards.map((card) => ({
                        title: card.name,
                        onClick: () => setCurrentCard(card),
                        color:
                          card.status == Status.Banned
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
            <div className="flex flex-col h-full items-center justify-center">
              <span className="font-semibold">
                Current Category: {currentCategory ? currentCategory.name : ''}
              </span>
              <span className="font-semibold">
                Current Card: {currentCard ? currentCard.name : ''}
              </span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}

export default App;
