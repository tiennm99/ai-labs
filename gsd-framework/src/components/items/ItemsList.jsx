import { store } from '../../store/billStore.js';
import { formatCurrency } from '../../utils/currency.js';
import { ItemAssign } from './ItemAssign.jsx';

export function ItemsList() {
  const items = store.items.value;

  if (items.length === 0) {
    return <p class="empty-state">No items added yet</p>;
  }

  return (
    <ul class="items-list">
      {items.map((item) => (
        <li key={item.id} class="item-row">
          <div class="item-header">
            <span class="item-name">{item.name}</span>
            <span class="item-price">{formatCurrency(item.priceCents)}</span>
          </div>
          <ItemAssign item={item} />
        </li>
      ))}
    </ul>
  );
}
