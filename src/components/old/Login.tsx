import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CREDENTIALS, Role } from '@/constants';
import { useCallback, useState } from 'react';

function Login({ setRole, setUser }: { setRole: Function; setUser: Function }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const login = useCallback(() => {
    console.log('Logging in with user ' + username);
    const matchingUser = CREDENTIALS.filter(
      (user: any) =>
        user.username.toLowerCase() == username.toLowerCase() &&
        user.password == password
    );
    if (matchingUser.length == 1) {
      switch (matchingUser[0].role.toLowerCase()) {
        case 'admin':
          setRole(Role.Admin);
          setUser(username.charAt(0).toUpperCase() + username.slice(1));
          console.log('Set Role to Admin');
          break;
        case 'manager':
          setRole(Role.Manager);
          setUser(username.charAt(0).toUpperCase() + username.slice(1));
          console.log('Set Role to Manager');
          break;
        default:
          setRole(Role.Spectator);
          setUser(username.charAt(0).toUpperCase() + username.slice(1));
          console.log('Set Role to Spectator');
          break;
      }
    } else {
      setUser('');
      setRole(Role.Spectator);
      console.log('Incorrect credentials.');
    }
    setLoginDialogOpen(false);
  }, [username, password]);

  return (
    <Popover open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
      <PopoverTrigger asChild>
        <Button
          className="absolute top-1 right-0 m-4 bg-orange-500 p-2 px-4 rounded-lg border-orange-500 text-white font-bold"
          variant="outline"
        >
          Login
        </Button>
      </PopoverTrigger>
      <PopoverContent className="absolute -top-10 -right-10 w-80 bg-zinc-700 text-white font-bold">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-white font-bold" htmlFor="width">
                Name
              </Label>
              <Input
                id="width"
                className="col-span-2 h-8"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label className="text-white font-bold" htmlFor="maxWidth">
                Password
              </Label>
              <Input
                id="maxWidth"
                className="col-span-2 h-8"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    login();
                  }
                }}
              />
            </div>
          </div>
        </div>
        <Button
          className="m-3 ml-[100px] bg-orange-500 text-white p-2 px-4 rounded-lg border-orange-500 font-bold"
          variant="outline"
          onClick={() => login()}
        >
          Login
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export default Login;
