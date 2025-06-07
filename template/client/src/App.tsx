import { User } from '../../shared';
import './App.css';
import { useUserContext } from './context/user';

export function App() {
  const user = useUserContext();
  console.log(`user: ${JSON.stringify(user.user)}`);
  return (
    <>
      <h1>Parcel React App 2</h1>
      <p>Edit <code>src/App.tsx</code> to get started!</p>
    </>
  );
}
