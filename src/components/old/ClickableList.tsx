import { Color } from '@/constants';

export interface ListEntry {
  title: string;
  onClick: Function;
  color: Color;
}

export function ClickableList({ listEntries }: { listEntries: ListEntry[] }) {
  return (
    <div className="flex flex-col h-full w-full items-start pl-4 whitespace-nowrap overflow-x-hidden overflow-y-scroll">
      {listEntries.map((entry) => (
        <span
          key={entry.title}
          onClick={() => entry.onClick()}
          style={{ color: entry.color, cursor: 'pointer' }}
        >
          {entry.title}
        </span>
      ))}
    </div>
  );
}
