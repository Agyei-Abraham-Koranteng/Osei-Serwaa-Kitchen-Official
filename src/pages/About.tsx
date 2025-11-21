import { Card, CardContent } from '@/components/ui/card';
import { Users, Heart, Award, Utensils } from 'lucide-react';
import heroRestaurant from '@/assets/hero-restaurant.jpg';

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${heroRestaurant})` }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              About <span className="gradient-text">Us</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Bringing authentic Ghanaian flavors to your table since 2010
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-24 bg-gradient-subtle">

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Osei Serwaa Kitchen was founded with a simple mission: to share the rich culinary heritage of Ghana
              with food lovers everywhere. Our restaurant is named after our founder's grandmother, Osei Serwaa,
              whose recipes and cooking techniques have been passed down through generations.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Every dish we serve is prepared using traditional methods and authentic ingredients, ensuring that
              each bite transports you to the vibrant streets and warm kitchens of Ghana. From our signature jollof
              rice to our perfectly seasoned banku, we take pride in maintaining the authentic flavors that have
              made Ghanaian cuisine beloved worldwide.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Our commitment to quality, authenticity, and excellent service has made us a favorite destination for
              those seeking genuine Ghanaian food. Whether you're from Ghana or discovering these flavors for the
              first time, we invite you to experience the warmth and hospitality that define our kitchen.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl shadow-card hover:scale-105 transition-transform duration-500" />
            <div className="aspect-square bg-gradient-to-br from-accent/20 to-secondary/20 rounded-2xl shadow-card hover:scale-105 transition-transform duration-500 mt-8" />
            <div className="aspect-square bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl shadow-card hover:scale-105 transition-transform duration-500 -mt-8" />
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl shadow-card hover:scale-105 transition-transform duration-500" />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center mb-16">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: 'Authenticity',
                description: 'We stay true to traditional recipes and cooking methods',
              },
              {
                icon: Award,
                title: 'Quality',
                description: 'Only the freshest ingredients make it to your plate',
              },
              {
                icon: Users,
                title: 'Community',
                description: 'We bring people together through food and culture',
              },
              {
                icon: Utensils,
                title: 'Excellence',
                description: 'Every dish is prepared with care and passion',
              },
            ].map((value, index) => (
              <Card key={index} className="hover:shadow-card transition-all duration-500 hover-scale group border-border/50 hover:border-primary/20">
                <CardContent className="pt-10 pb-8 text-center space-y-5">
                  <div className="flex justify-center">
                    <div className="p-5 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-sm">
                      <value.icon className="h-9 w-9 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-4xl font-bold text-center mb-16">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              {
                name: 'Kwame Osei',
                role: 'Head Chef',
                description: 'With 20 years of experience in traditional Ghanaian cooking',
              },
              {
                name: 'Akosua Mensah',
                role: 'Restaurant Manager',
                description: 'Ensuring every guest feels at home in our kitchen',
              },
              {
                name: 'Kofi Asante',
                role: 'Sous Chef',
                description: 'Bringing innovation while respecting tradition',
              },
            ].map((member, index) => (
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
