import { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { MenuItem } from '@/context/RestaurantContext';
import heroImage from '@/assets/hero-restaurant.jpg';

const MenuManagement = () => {
  const { menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem, setHeroImage, heroTexts, setHeroText } = useRestaurant();

  const [pageHeader, setPageHeader] = useState({
    title: heroTexts?.menu?.title || 'Our Menu',
    subtitle: heroTexts?.menu?.subtitle || 'Explore our selection of authentic Ghanaian dishes, prepared fresh daily with traditional recipes',
  });
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    categoryId: '',
    image: '',
    featured: false,
    available: true,
    spicyLevel: '0',
  });

  // Hero image editing state for Menu page
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

  const handleSaveHero = () => {
    if (heroImgPreview) setHeroImage('menu', heroImgPreview);
    setHeroText('menu', { title: pageHeader.title, subtitle: pageHeader.subtitle });
    toast({ title: 'Hero saved', description: 'Menu hero image and text updated.' });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      categoryId: '',
      image: '',
      featured: false,
      available: true,
      spicyLevel: '0',
    });
    setEditingItem(null);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      categoryId: item.categoryId,
      image: item.image,
      featured: item.featured,
      available: item.available,
      spicyLevel: item.spicyLevel.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.categoryId) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const category = categories.find((c) => c.id === formData.categoryId);
    if (!category) return;

    const itemData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: category.name,
      categoryId: formData.categoryId,
      image: formData.image,
      featured: formData.featured,
      available: formData.available,
      spicyLevel: parseInt(formData.spicyLevel),
    };

    if (editingItem) {
      updateMenuItem(editingItem.id, itemData);
      toast({
        title: 'Item updated',
        description: 'Menu item has been updated successfully.',
      });
    } else {
      addMenuItem(itemData);
      toast({
        title: 'Item added',
        description: 'New menu item has been added successfully.',
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMenuItem(id);
      toast({
        title: 'Item deleted',
        description: 'Menu item has been deleted successfully.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative -mx-6 -mt-6 mb-8 overflow-hidden rounded-b-xl">
        <div className="h-48 relative">
          <img src={heroImgPreview || heroImage} alt="Menu hero preview" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-10">
            <h1 className="text-4xl font-bold text-white mb-2">{heroTexts?.menu?.title || 'Our Menu'}</h1>
            <p className="text-white/90">{heroTexts?.menu?.subtitle || 'Explore our selection of authentic Ghanaian dishes, prepared fresh daily with traditional recipes'}</p>
          </div>
        </div>
      </div>

      {/* Hero Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Image</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="hero-image">Hero Image</Label>
          <Input type="file" id="hero-image" accept="image/*" onChange={handleHeroImgChange} />
          {heroImgPreview && (
            <img src={heroImgPreview} alt="Hero Preview" className="mt-2 h-32 rounded shadow" />
          )}
        </CardContent>
      </Card>

      {/* Page Header (Title & Subtitle) */}
      <Card>
        <CardHeader>
          <CardTitle>Page Header</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hero-title">Hero Title</Label>
              <Input
                id="hero-title"
                value={pageHeader.title}
                onChange={(e) => setPageHeader({ ...pageHeader, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
              <Input
                id="hero-subtitle"
                value={pageHeader.subtitle}
                onChange={(e) => setPageHeader({ ...pageHeader, subtitle: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleSaveHero} size="sm">Save Hero</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Name *</Label>
                <Input
                  id="item-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  id="item-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item-category">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => {
                      const category = categories.find((c) => c.id === value);
                      setFormData({
                        ...formData,
                        categoryId: value,
                        category: category?.name || '',
                      });
                    }}
                  >
                    <SelectTrigger id="item-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              <div className="space-y-2">
                <Label htmlFor="item-spicy">Spicy Level</Label>
                <Select
                  value={formData.spicyLevel}
                  onValueChange={(value) => setFormData({ ...formData, spicyLevel: value })}
                >
                  <SelectTrigger id="item-spicy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Not Spicy</SelectItem>
                    <SelectItem value="1">Mild</SelectItem>
                    <SelectItem value="2">Medium</SelectItem>
                    <SelectItem value="3">Hot</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-image">Image URL</Label>
                <Input
                  id="item-image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Optional - leave empty for default icon"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <Label htmlFor="item-featured">Featured Item</Label>
                <Switch
                  id="item-featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <Label htmlFor="item-available">Available</Label>
                <Switch
                  id="item-available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">GH₵ {item.price.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">{item.category}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="flex-1 gap-2">
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(item.id, item.name)}
                  className="flex-1 gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement;
