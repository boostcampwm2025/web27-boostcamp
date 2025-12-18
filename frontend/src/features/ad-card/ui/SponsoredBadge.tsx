import { Badge } from '@/shared/ui/Badge/Badge';
import { Icon } from '@/shared/ui/Icon/Icon';

export const SponsoredBadge = () => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon name="sparkles" size={16} className="text-warning-800" />
      <Badge variant="sponsored">Sponsored</Badge>
    </div>
  );
};
