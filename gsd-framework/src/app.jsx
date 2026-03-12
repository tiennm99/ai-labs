import { PersonForm } from './components/people/PersonForm.jsx';
import { PeopleList } from './components/people/PeopleList.jsx';

export function App() {
  return (
    <div class="app">
      <h1>Bill Splitter</h1>

      <section class="people-section">
        <h2>People</h2>
        <PersonForm />
        <PeopleList />
      </section>
    </div>
  );
}
