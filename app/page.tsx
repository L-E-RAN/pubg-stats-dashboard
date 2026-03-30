import { SearchPanel } from '@/components/SearchPanel';
import { FavoritesPanel } from '@/components/FavoritesPanel';

export default function HomePage() {
  return (
    <main className="page">
      <div className="container stack-lg">
        <SearchPanel />
        <FavoritesPanel />
      </div>
    </main>
  );
}
