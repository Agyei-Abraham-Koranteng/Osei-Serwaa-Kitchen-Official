import { Card, CardContent } from '@/components/ui/card';
import { Users, Heart, Award, Utensils, ChefHat } from 'lucide-react';
import heroRestaurant from '@/assets/hero-restaurant.jpg';
import { useRestaurant } from '@/context/RestaurantContext';

const About = () => {
  const { heroImages, aboutContent, heroTexts } = useRestaurant();
  const hero = heroImages.about || heroRestaurant;
  const heroTitle = heroTexts?.about?.title || 'About Us';
  const heroSubtitle = heroTexts?.about?.subtitle || aboutContent?.story?.paragraph1;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 scale-105 blur-[0.5px]">
          <img src={hero} alt="About hero" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center py-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="animate-fade-in space-y-6">
              <div className="flex justify-center mb-4">
                <ChefHat className="h-16 w-16 text-primary" strokeWidth={1.5} />
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-white">
                {heroTitle || 'About Us'}
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                {heroSubtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-24 bg-gradient-subtle">

        {/* Story Section - each paragraph paired with its image so admin updates reflect inline */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold mb-8">Our Story</h2>
          <div className="space-y-12">
            {[
              aboutContent?.story?.paragraph1,
              aboutContent?.story?.paragraph2,
              aboutContent?.story?.paragraph3,
            ].map((para, idx) => (
              <div key={idx} className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-muted-foreground leading-relaxed text-lg">{para}</p>
                </div>
                <div className="w-full">
                  {aboutContent?.storyImages && aboutContent.storyImages[idx] ? (
                    <div className="rounded-2xl overflow-hidden shadow-card">
                      <img src={aboutContent.storyImages[idx]} alt={`Story image ${idx + 1}`} className="w-full h-64 object-cover" />
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 h-64 shadow-card" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center mb-16">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(aboutContent?.values || []).map((value, index) => {
              const icons = [Heart, Award, Users, Utensils];
              const Icon = icons[index % icons.length];
              return (
                <Card key={index} className="hover:shadow-card transition-all duration-500 hover-scale group border-border/50 hover:border-primary/20">
                  <CardContent className="pt-10 pb-8 text-center space-y-5">
                    <div className="flex justify-center">
                      <div className="p-5 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-sm">
                        <Icon className="h-9 w-9 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-4xl font-bold text-center mb-16">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {(aboutContent?.team || []).map((member, index) => (
              <Card key={index} className="hover:shadow-card transition-all duration-500 hover-scale border-border/50 hover:border-primary/20">
                <CardContent className="pt-8 text-center space-y-4">
                  <div className="w-28 h-28 mx-auto bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-full shadow-md" />
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary font-semibold text-lg">{member.role}</p>
                  <p className="text-muted-foreground leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
