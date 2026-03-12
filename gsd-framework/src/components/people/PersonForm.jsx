import { useState } from 'preact/hooks';
import { store } from '../../store/billStore.js';

export function PersonForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = store.addPerson(name);
    if (result.success) {
      setName('');
      setError('');
    } else {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="person-form">
      <input
        type="text"
        value={name}
        onInput={(e) => setName(e.target.value)}
        placeholder="Enter name"
        aria-label="Person name"
      />
      <button type="submit">Add Person</button>
      {error && <p class="error">{error}</p>}
    </form>
  );
}
