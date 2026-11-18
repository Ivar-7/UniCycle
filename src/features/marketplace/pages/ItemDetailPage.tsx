import { useParams } from 'react-router-dom';
import { ItemDetailView } from '../components/ItemDetailView';

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <ItemDetailView key={id ?? 'missing'} itemId={id} />;
}
