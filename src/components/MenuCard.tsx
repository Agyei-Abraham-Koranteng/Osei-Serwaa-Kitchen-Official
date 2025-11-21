import { Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MenuItem } from '@/context/RestaurantContext';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard = ({ item }: MenuCardProps) => {
  const hasImage = item.image && item.image.trim() !== '';

  return (
    <Card className="group overflow-hidden hover:shadow-card transition-all duration-500 border-border/50 hover:border-primary/20">
      <CardContent className="p-0">
        {/* Image Section */}
        {hasImage ? (
          <div className="relative h-52 overflow-hidden bg-muted">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            {item.featured && (
              <Badge className="absolute top-4 left-4 bg-gradient-warm text-primary-foreground shadow-md z-20 border-0">
                ⭐ Featured
              </Badge>
            )}
            {item.spicyLevel > 0 && (
              <div className="absolute top-4 right-4 glass rounded-full p-2 z-20">
                {Array.from({ length: item.spicyLevel }).map((_, i) => (
                  <Flame key={i} className="h-3.5 w-3.5 text-destructive inline-block" />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="relative h-52 bg-gradient-to-br from-primary/10 via-accent/10 to-muted flex items-center justify-center">
            <span className="text-7xl opacity-30 group-hover:scale-110 transition-transform duration-500">🍽️</span>
            {item.featured && (
              <Badge className="absolute top-4 left-4 bg-gradient-warm text-primary-foreground shadow-md border-0">
                ⭐ Featured
              </Badge>
            )}
          </div>
        )}

        {/* Content Section */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-2xl font-bold bg-gradient-warm bg-clip-text text-transparent">
              GH₵ {item.price.toFixed(2)}
            </p>
            <Badge variant="secondary" className="text-xs font-medium">
              {item.category}
            </Badge>
          </div>

          {!item.available && (
            <div className="pt-2 mt-2 border-t border-destructive/20">
              <p className="text-xs text-destructive text-center font-medium">Currently unavailable</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuCard;
