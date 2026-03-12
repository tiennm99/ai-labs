import { useState } from 'preact/hooks';
import { store } from '../../store/billStore.js';

export function ItemForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = store.addItem(name, price);
    if (result.success) {
      setName('');
      setPrice('');
      setError('');
    } else {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="item-form">
      <input
        type="text"
        value={name}
        onInput={(e) => setName(e.target.value)}
        placeholder="Item name"
        aria-label="Item name"
      />
      <input
        type="text"
        value={price}
        onInput={(e) => setPrice(e.target.value)}
        placeholder="Price (e.g., 15.99)"
        aria-label="Item price"
      />
      <button type="submit">Add Item</button>
      {error && <p class="error">{error}</p>}
    </form>
  );
}
