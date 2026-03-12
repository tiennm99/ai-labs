import { PersonForm } from './components/people/PersonForm.jsx';
import { PeopleList } from './components/people/PeopleList.jsx';
import { ItemForm } from './components/items/ItemForm.jsx';
import { ItemsList } from './components/items/ItemsList.jsx';

export function App() {
  return (
    <div class="app">
      <h1>Bill Splitter</h1>

      <section class="people-section">
        <h2>People</h2>
        <PersonForm />
        <PeopleList />
      </section>

      <section class="items-section">
        <h2>Items</h2>
        <ItemForm />
        <ItemsList />
      </section>
    </div>
  );
}
