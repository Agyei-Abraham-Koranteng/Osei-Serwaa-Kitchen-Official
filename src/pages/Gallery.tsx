import { Card, CardContent } from '@/components/ui/card';
import dishJollof from '@/assets/dish-jollof.jpg';
import dishWaakye from '@/assets/dish-waakye.jpg';
import dishBanku from '@/assets/dish-banku.jpg';
import heroRestaurant from '@/assets/hero-restaurant.jpg';
import { useRestaurant } from '@/context/RestaurantContext';
import { ChefHat } from 'lucide-react';

const Gallery = () => {
  const { heroImages, galleryImages, heroTexts } = useRestaurant();
  const hero = heroImages.gallery || heroRestaurant;
  const images = (galleryImages && galleryImages.length > 0)
    ? galleryImages
    : [
      { id: 1, src: heroRestaurant, alt: 'Restaurant Interior', category: 'Ambiance' },
      { id: 2, src: dishJollof, alt: 'Jollof Rice', category: 'Dishes' },
      { id: 3, src: dishWaakye, alt: 'Waakye', category: 'Dishes' },
      { id: 4, src: dishBanku, alt: 'Banku', category: 'Dishes' },
      { id: 5, src: heroRestaurant, alt: 'Dining Experience', category: 'Ambiance' },
      { id: 6, src: dishJollof, alt: 'Signature Dish', category: 'Dishes' },
    ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 scale-105 blur-[0.5px]">
          <img src={hero} alt="Gallery hero" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center py-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="animate-fade-in space-y-6">
              <div className="flex justify-center mb-4">
                <ChefHat className="h-16 w-16 text-primary" strokeWidth={1.5} />
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-white">
                {heroTexts?.gallery?.title ? <span className="gradient-text">{heroTexts.gallery.title}</span> : <span className="gradient-text">Gallery</span>}
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                {heroTexts?.gallery?.subtitle || 'Experience the vibrant atmosphere and authentic Ghanaian cuisine at Osei Serwaa Kitchen'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20 bg-muted/30">

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <Card key={image.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-sm font-medium text-primary">{image.category}</p>
                      <p className="text-lg font-semibold text-foreground">{image.alt}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
