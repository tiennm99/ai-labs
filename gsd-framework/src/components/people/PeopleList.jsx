import { store } from '../../store/billStore.js';

export function PeopleList() {
  const people = store.people.value;

  if (people.length === 0) {
    return <p class="empty-state">No people added yet</p>;
  }

  return (
    <ul class="people-list">
      {people.map((person) => (
        <li key={person.id}>{person.name}</li>
      ))}
    </ul>
  );
}
