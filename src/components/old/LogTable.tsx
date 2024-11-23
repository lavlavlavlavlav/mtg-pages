import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Log, Role } from '@/constants';
import { Button } from '../ui/button';

function LogTable({
  entries,
  deleteFunction,
  userRole,
}: {
  entries: Log[] | undefined;
  deleteFunction: Function;
  userRole: Role;
}) {
  if (!entries) return null;

  return (
    <Table className="h-full overflow-hidden">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Timestamp</TableHead>
          <TableHead>User</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries?.map((entry) => (
          <TableRow key={entry.timestamp.toString() + entry.from + entry.to}>
            <TableCell className="font-medium">
              {entry.timestamp.toLocaleString()}
            </TableCell>
            <TableCell>{entry.user}</TableCell>
            <TableCell>{entry.from}</TableCell>
            <TableCell>{entry.to}</TableCell>
            <TableCell className="text-right">
              {userRole == Role.Admin ? (
                <Button onClick={() => deleteFunction(entry.timestamp)}>
                  X
                </Button>
              ) : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter></TableFooter>
    </Table>
  );
}

export default LogTable;
