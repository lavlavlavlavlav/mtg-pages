import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Comment, Role } from '@/constants';
import { Button } from '../ui/button';

function CommentTable({
  entries,
  deleteFunction,
  userRole,
}: {
  entries: Comment[] | undefined;
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
          <TableHead>Message</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries?.map((entry) => (
          <TableRow key={entry.timestamp + entry.poster + entry.message}>
            <TableCell
              key={entry.timestamp + entry.poster + entry.message + 'time'}
              className="font-medium"
            >
              {entry.timestamp.toLocaleString()}
            </TableCell>
            <TableCell
              key={entry.timestamp + entry.poster + entry.message + 'poster'}
            >
              {entry.poster}
            </TableCell>
            <TableCell
              key={entry.timestamp + entry.poster + entry.message + 'message'}
            >
              {entry.message}
            </TableCell>
            <TableCell
              key={entry.timestamp + entry.poster + entry.message + 'action'}
              className="text-right"
            >
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

export default CommentTable;
