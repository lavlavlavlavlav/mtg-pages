import './App.css';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Card, Role } from '@/constants';
import { loadCardsFromBucket } from '@/helpers';
import { useEffect, useState } from 'react';
import Login from './Login';

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [role, setRole] = useState(Role.Spectator);

  useEffect(() => {
    loadCardsFromBucket().then((c) => {
      setCards(c);
    });
  }, []);

  if (cards.length == 0) return null;

  return (
    <>
      <span className="text-white font-bold absolute top-6 right-[150px]">
        Role: {role}
      </span>
      <Login setRole={setRole}></Login>
      <div className="h-screen w-full overflow-hidden bg-zinc-900 text-white font-bold">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={15}>
            <div className="flex h-full items-center justify-center">
              <span className="font-semibold">Sidebar</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={85}>
            <div className="flex h-full items-center justify-center">
              <span className="font-semibold">Content</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}

export default App;
