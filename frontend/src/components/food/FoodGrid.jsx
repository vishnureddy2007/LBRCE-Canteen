import FoodCard from './FoodCard';
import EmptyState from '../common/EmptyState';
import { UtensilsCrossed } from 'lucide-react';

export default function FoodGrid({ foods }) {
  if (!foods || foods.length === 0) {
    return (
      <EmptyState
        icon={UtensilsCrossed}
        title="Nothing to show yet"
        description="Try clearing your filters or check back later."
      />
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {foods.map((f) => <FoodCard key={f.id} food={f} />)}
    </div>
  );
}