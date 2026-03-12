import { store } from '../../store/billStore.js';

export function ItemAssign({ item }) {
  const assignedTo = store.getAssignedPeople(item.id);

  const togglePerson = (personId) => {
    const current = assignedTo.includes(personId)
      ? assignedTo.filter(id => id !== personId)
      : [...assignedTo, personId];
    store.setAssignment(item.id, current);
  };

  const people = store.people.value;

  if (people.length === 0) {
    return <p class="hint">Add people first to assign items</p>;
  }

  return (
    <div class="item-assign">
      <span class="assign-label">Split between:</span>
      {people.map((person) => (
        <label key={person.id} class="checkbox-label">
          <input
            type="checkbox"
            checked={assignedTo.includes(person.id)}
            onChange={() => togglePerson(person.id)}
          />
          {person.name}
        </label>
      ))}
    </div>
  );
}
