import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-restaurant.jpg';

const HomeContentManagement = () => {
  const { toast } = useToast();
  const { setHeroImage, setHomeContent, heroTexts, setHeroText } = useRestaurant();
  const [heroContent, setHeroContent] = useState({
    title: heroTexts?.home?.title || 'Osei Serwaa Kitchen',
    subtitle: heroTexts?.home?.subtitle || 'Authentic West African Cuisine',
    tagline: heroTexts?.home?.tagline || 'Experience the rich flavors and traditions of Ghana in every dish',
  });

  const [features, setFeatures] = useState([
    { title: 'Award Winning', description: 'Recognized for excellence in authentic cuisine' },
    { title: 'Quality Ingredients', description: 'Fresh, locally sourced ingredients daily' },
    { title: 'Fast Service', description: 'Quick preparation without compromising quality' },
    { title: 'Made with Love', description: 'Every dish prepared with care and passion' },
  ]);

  const [ctaSection, setCtaSection] = useState({
    title: 'Ready to Experience True Ghanaian Flavors?',
    description: 'Book a table and come experience the best of authentic Ghanaian cuisine.',
  });

  // Hero image editing state
  const [heroImgPreview, setHeroImgPreview] = useState<string | null>(null);
  const [heroImgFile, setHeroImgFile] = useState<File | null>(null);

  const handleHeroImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImgPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // persist home content and hero image
    setHomeContent({ hero: heroContent, features, cta: ctaSection });
    // Persist hero text separately so public pages reflect these values
    setHeroText('home', { title: heroContent.title, subtitle: heroContent.subtitle, tagline: heroContent.tagline });
    if (heroImgPreview) {
      setHeroImage('home', heroImgPreview);
    }
    toast({
      title: 'Changes saved!',
      description: 'Home page content has been updated successfully.',
    });
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative -mx-6 -mt-6 mb-8 overflow-hidden rounded-b-xl">
        <div className="h-48 relative">
          <img src={heroImgPreview || heroImage} alt="Home hero preview" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
      </div>

      {/* Hero Image */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hero Image Upload */}
          <div>
            <Label htmlFor="hero-image">Hero Image</Label>
            <Input type="file" id="hero-image" accept="image/*" onChange={handleHeroImgChange} />
            {heroImgPreview && (
              <img src={heroImgPreview} alt="Hero Preview" className="mt-2 h-32 rounded shadow" />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-tagline">Tagline</Label>
            <Textarea
              id="hero-tagline"
              value={heroContent.tagline}
              onChange={(e) => setHeroContent({ ...heroContent, tagline: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Page Header (Title & Subtitle) */}
      <Card>
        <CardHeader>
          <CardTitle>Page Header</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero-title">Title</Label>
            <Input
              id="hero-title"
              value={heroContent.title}
              onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Subtitle</Label>
            <Input
              id="hero-subtitle"
              value={heroContent.subtitle}
              onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Features Section */}
      <Card>
        <CardHeader>
          <CardTitle>Features Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {features.map((feature, index) => (
            <div key={index} className="border-b pb-6 last:border-0">
              <h3 className="font-semibold mb-3">Feature {index + 1}</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor={`feature-title-${index}`}>Title</Label>
                  <Input
                    id={`feature-title-${index}`}
                    value={feature.title}
                    onChange={(e) => {
                      const newFeatures = [...features];
                      newFeatures[index].title = e.target.value;
                      setFeatures(newFeatures);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`feature-desc-${index}`}>Description</Label>
                  <Textarea
                    id={`feature-desc-${index}`}
                    value={feature.description}
                    onChange={(e) => {
                      const newFeatures = [...features];
                      newFeatures[index].description = e.target.value;
                      setFeatures(newFeatures);
                    }}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card>
        <CardHeader>
          <CardTitle>Call-to-Action Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cta-title">Title</Label>
            <Input
              id="cta-title"
              value={ctaSection.title}
              onChange={(e) => setCtaSection({ ...ctaSection, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta-description">Description</Label>
            <Textarea
              id="cta-description"
              value={ctaSection.description}
              onChange={(e) => setCtaSection({ ...ctaSection, description: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave}>
          Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default HomeContentManagement;
