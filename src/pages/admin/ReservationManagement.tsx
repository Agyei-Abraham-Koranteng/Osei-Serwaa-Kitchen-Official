import { useRestaurant } from '@/context/RestaurantContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Trash2, Calendar, Clock, Users, Printer } from 'lucide-react';
import { Reservation } from '@/context/RestaurantContext';
import heroImage from '@/assets/hero-restaurant.jpg';

const ReservationManagement = () => {
  const { reservations, updateReservationStatus, deleteReservation, setHeroImage, heroTexts, setHeroText } = useRestaurant();
  const { toast } = useToast();

  const [pageHeader, setPageHeader] = useState({
    title: heroTexts?.reservations?.title || 'Reservations',
    subtitle: heroTexts?.reservations?.subtitle || '',
  });

  const [heroImgPreview, setHeroImgPreview] = useState<string | null>(null);

  const handleHeroImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setHeroImgPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveHero = () => {
    if (heroImgPreview) setHeroImage('reservations', heroImgPreview);
    setHeroText('reservations', { title: pageHeader.title, subtitle: pageHeader.subtitle });
    toast({ title: 'Hero saved', description: 'Reservations hero image and text updated.' });
  };

  const handlePrint = (reservation: Reservation) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Reservation - ${reservation.name}</title></head><body style="font-family: Arial, sans-serif; padding:20px;">` +
      `<h1>Reservation - ${reservation.name}</h1>` +
      `<div style="margin-top:12px;"><pre style="white-space:pre-wrap;">${JSON.stringify(reservation, null, 2)}</pre></div>` +
      `</body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleStatusChange = (id: string, newStatus: Reservation['status']) => {
    updateReservationStatus(id, newStatus);
    toast({ title: 'Status updated', description: 'Reservation status has been updated successfully.' });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the reservation for ${name}?`)) {
      deleteReservation(id);
      toast({ title: 'Reservation deleted', description: 'The reservation has been removed.' });
    }
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const sortedReservations = [...reservations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative -mx-6 -mt-6 mb-8 overflow-hidden rounded-b-xl">
        <div className="h-48 relative">
          <img src={heroImgPreview || heroImage} alt="Reservations hero preview" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-10">
            <h1 className="text-4xl font-bold text-white mb-2">Reservation Management</h1>
            <p className="text-white/90">View and manage reservations</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero Image</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="hero-image">Hero Image</Label>
          <Input type="file" id="hero-image" accept="image/*" onChange={handleHeroImgChange} />
          {heroImgPreview && <img src={heroImgPreview} className="mt-2 h-32 rounded shadow" alt="Hero Preview" />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Page Header</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hero-title">Title</Label>
              <Input id="hero-title" value={pageHeader.title} onChange={(e) => setPageHeader({ ...pageHeader, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input id="hero-subtitle" value={pageHeader.subtitle} onChange={(e) => setPageHeader({ ...pageHeader, subtitle: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleSaveHero} size="sm">Save Hero</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {sortedReservations.length > 0 ? (
          sortedReservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{reservation.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{reservation.id}</p>
                  </div>
                  <Badge className={getStatusColor(reservation.status)}>{reservation.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{reservation.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{reservation.phone}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium">{reservation.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-medium">{reservation.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Guests</p>
                      <p className="text-sm font-medium">{reservation.guests}</p>
                    </div>
                  </div>
                </div>

                {reservation.specialRequests && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Special Requests</p>
                    <p className="text-sm">{reservation.specialRequests}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground">Created: {new Date(reservation.createdAt).toLocaleString()}</div>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" onClick={() => handlePrint(reservation)} className="gap-2">
                      <Printer className="h-4 w-4" /> Print
                    </Button>

                    <Select value={reservation.status} onValueChange={(value: Reservation['status']) => handleStatusChange(reservation.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="destructive" size="sm" onClick={() => handleDelete(reservation.id, reservation.name)} className="gap-2">
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No reservations yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReservationManagement;
import { useRestaurant } from '@/context/RestaurantContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Trash2, Calendar, Clock, Users, Printer } from 'lucide-react';
import { Reservation } from '@/context/RestaurantContext';
import heroImage from '@/assets/hero-restaurant.jpg';

const ReservationManagement = () => {
  const { reservations, updateReservationStatus, deleteReservation, setHeroImage, heroTexts, setHeroText } = useRestaurant();
  const { toast } = useToast();

  const [pageHeader, setPageHeader] = useState({
    title: heroTexts?.reservations?.title || 'Reservations',
    subtitle: heroTexts?.reservations?.subtitle || '',
  });

  // Hero image editing state
  const [heroImgPreview, setHeroImgPreview] = useState<string | null>(null);

  const handleHeroImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setHeroImgPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveHero = () => {
    if (heroImgPreview) setHeroImage('reservations', heroImgPreview);
    setHeroText('reservations', { title: pageHeader.title, subtitle: pageHeader.subtitle });
    toast({ title: 'Hero saved', description: 'Reservations hero image and text updated.' });
  };

  const handlePrint = (reservation: Reservation) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const printContent = `<!doctype html><html><head><meta charset="utf-8"><title>Reservation - ${reservation.name}</title></head><body style="font-family: sans-serif; padding: 20px;">
      <h1>Reservation - ${reservation.name}</h1>
      <div style="margin-top: 10px;">
        <strong>Details</strong>
        <pre style="white-space: pre-wrap;">${JSON.stringify(reservation, null, 2)}</pre>
      </div>
      <div style="margin-top:20px; font-size:14px; color:#666;">Osei Serwaa Kitchen</div>
      <script>window.onload = function(){ window.print(); };</script>
    </body></html>`;
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleStatusChange = (id: string, newStatus: Reservation['status']) => {
    updateReservationStatus(id, newStatus);
    toast({ title: 'Status updated', description: 'Reservation status has been updated successfully.' });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the reservation for ${name}?`)) {
      deleteReservation(id);
      toast({ title: 'Reservation deleted', description: 'The reservation has been removed.' });
    }
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const sortedReservations = [...reservations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative -mx-6 -mt-6 mb-8 overflow-hidden rounded-b-xl">
        <div className="h-48 relative">
          <img src={heroImgPreview || heroImage} alt="Reservations hero preview" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-10">
            <h1 className="text-4xl font-bold text-white mb-2">Reservation Management</h1>
            <p className="text-white/90">View and manage table reservations</p>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Image</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="hero-image">Hero Image</Label>
          <Input type="file" id="hero-image" accept="image/*" onChange={handleHeroImgChange} />
          {heroImgPreview && <img src={heroImgPreview} className="mt-2 h-32 rounded shadow" alt="Hero Preview" />}
        </CardContent>
      </Card>

      {/* Page Header */}
      <Card>
        <CardHeader>
          <CardTitle>Page Header</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hero-title">Title</Label>
              <Input id="hero-title" value={pageHeader.title} onChange={(e) => setPageHeader({ ...pageHeader, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input id="hero-subtitle" value={pageHeader.subtitle} onChange={(e) => setPageHeader({ ...pageHeader, subtitle: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleSaveHero} size="sm">Save Hero</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {sortedReservations.length > 0 ? (
          sortedReservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{reservation.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{reservation.id}</p>
                  </div>
                  <Badge className={getStatusColor(reservation.status)}>{reservation.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{reservation.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{reservation.phone}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium">{reservation.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-medium">{reservation.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Guests</p>
                      <p className="text-sm font-medium">{reservation.guests}</p>
                    </div>
                  </div>
                </div>

                {reservation.specialRequests && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Special Requests</p>
                    <p className="text-sm">{reservation.specialRequests}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground">Created: {new Date(reservation.createdAt).toLocaleString()}</div>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" onClick={() => handlePrint(reservation)} className="gap-2">
                      <Printer className="h-4 w-4" /> Print
                    </Button>

                    <Select value={reservation.status} onValueChange={(value: Reservation['status']) => handleStatusChange(reservation.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="destructive" size="sm" onClick={() => handleDelete(reservation.id, reservation.name)} className="gap-2">
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No reservations yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReservationManagement;
import { useRestaurant } from '@/context/RestaurantContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Trash2, Calendar, Clock, Users, Printer } from 'lucide-react';
import { Reservation } from '@/context/RestaurantContext';
import heroImage from '@/assets/hero-restaurant.jpg';

const ReservationManagement = () => {
  const { reservations, updateReservationStatus, deleteReservation, setHeroImage, heroTexts, setHeroText } = useRestaurant();
  const { toast } = useToast();

  const [pageHeader, setPageHeader] = useState({
    title: heroTexts?.reservations?.title || 'Reservations',
    subtitle: heroTexts?.reservations?.subtitle || '',
  });

  // Hero image editing state
  const [heroImgPreview, setHeroImgPreview] = useState<string | null>(null);
  const [heroImgFile, setHeroImgFile] = useState<File | null>(null);

  const handleHeroImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setHeroImgPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveHero = () => {
    if (heroImgPreview) setHeroImage('reservations', heroImgPreview);
    setHeroText('reservations', { title: pageHeader.title, subtitle: pageHeader.subtitle });
    toast({ title: 'Hero saved', description: 'Reservations hero image and text updated.' });
  };

  const handlePrint = (reservation: Reservation) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const printContent = `<html><body><h1>Reservation - ${reservation.name}</h1><pre>${JSON.stringify(reservation, null, 2)}</pre></body></html>`;
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleStatusChange = (id: string, newStatus: Reservation['status']) => {
    updateReservationStatus(id, newStatus);
    toast({ title: 'Status updated', description: 'Reservation status has been updated successfully.' });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the reservation for ${name}?`)) {
      deleteReservation(id);
      toast({ title: 'Reservation deleted', description: 'The reservation has been removed.' });
    }
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const sortedReservations = [...reservations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative -mx-6 -mt-6 mb-8 overflow-hidden rounded-b-xl">
        <div className="h-48 relative">
          <img src={heroImgPreview || heroImage} alt="Reservations hero preview" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-10">
            <h1 className="text-4xl font-bold text-white mb-2">Reservation Management</h1>
            <p className="text-white/90">View and manage table reservations</p>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Image</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="hero-image">Hero Image</Label>
          <Input type="file" id="hero-image" accept="image/*" onChange={handleHeroImgChange} />
          {heroImgPreview && <img src={heroImgPreview} className="mt-2 h-32 rounded shadow" alt="Hero Preview" />}
        </CardContent>
      </Card>

      {/* Page Header */}
      <Card>
        <CardHeader>
          <CardTitle>Page Header</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hero-title">Title</Label>
              <Input id="hero-title" value={pageHeader.title} onChange={(e) => setPageHeader({ ...pageHeader, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input id="hero-subtitle" value={pageHeader.subtitle} onChange={(e) => setPageHeader({ ...pageHeader, subtitle: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleSaveHero} size="sm">Save Hero</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {sortedReservations.length > 0 ? (
          sortedReservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{reservation.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{reservation.id}</p>
                  </div>
                  <Badge className={getStatusColor(reservation.status)}>{reservation.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{reservation.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{reservation.phone}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium">{reservation.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-medium">{reservation.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Guests</p>
                      <p className="text-sm font-medium">{reservation.guests}</p>
                    </div>
                  </div>
                </div>

                {reservation.specialRequests && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Special Requests</p>
                    <p className="text-sm">{reservation.specialRequests}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground">Created: {new Date(reservation.createdAt).toLocaleString()}</div>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" onClick={() => handlePrint(reservation)} className="gap-2">
                      <Printer className="h-4 w-4" /> Print
                    </Button>

                    <Select value={reservation.status} onValueChange={(value: Reservation['status']) => handleStatusChange(reservation.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="destructive" size="sm" onClick={() => handleDelete(reservation.id, reservation.name)} className="gap-2">
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No reservations yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReservationManagement;
import { useRestaurant } from '@/context/RestaurantContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Trash2, Calendar, Clock, Users, Printer } from 'lucide-react';
import { Reservation } from '@/context/RestaurantContext';
import heroImage from '@/assets/hero-restaurant.jpg';

const ReservationManagement = () => {
  const { reservations, updateReservationStatus, deleteReservation, setHeroImage, heroTexts, setHeroText } = useRestaurant();
  const { toast } = useToast();

  const [pageHeader, setPageHeader] = useState({
    title: heroTexts?.reservations?.title || 'Reservations',
    subtitle: heroTexts?.reservations?.subtitle || '',
  });

  // Hero image editing state
  const [heroImgPreview, setHeroImgPreview] = useState<string | null>(null);
  const [heroImgFile, setHeroImgFile] = useState<File | null>(null);

  const handleHeroImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setHeroImgPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveHero = () => {
    if (heroImgPreview) setHeroImage('reservations', heroImgPreview);
    setHeroText('reservations', { title: pageHeader.title, subtitle: pageHeader.subtitle });
    toast({ title: 'Hero saved', description: 'Reservations hero image and text updated.' });
  };

  const handlePrint = (reservation: Reservation) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const printContent = `<html><body><h1>Reservation - ${reservation.name}</h1><pre>${JSON.stringify(reservation, null, 2)}</pre></body></html>`;
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleStatusChange = (id: string, newStatus: Reservation['status']) => {
    updateReservationStatus(id, newStatus);
    toast({ title: 'Status updated', description: 'Reservation status has been updated successfully.' });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the reservation for ${name}?`)) {
      deleteReservation(id);
      toast({ title: 'Reservation deleted', description: 'The reservation has been removed.' });
    }
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const sortedReservations = [...reservations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative -mx-6 -mt-6 mb-8 overflow-hidden rounded-b-xl">
        <div className="h-48 relative">
          <img src={heroImgPreview || heroImage} alt="Reservations hero preview" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-10">
            <h1 className="text-4xl font-bold text-white mb-2">Reservation Management</h1>
            <p className="text-white/90">View and manage table reservations</p>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Image</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="hero-image">Hero Image</Label>
          <Input type="file" id="hero-image" accept="image/*" onChange={handleHeroImgChange} />
          {heroImgPreview && <img src={heroImgPreview} className="mt-2 h-32 rounded shadow" alt="Hero Preview" />}
        </CardContent>
      </Card>

      {/* Page Header */}
      <Card>
        <CardHeader>
          <CardTitle>Page Header</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hero-title">Title</Label>
              <Input id="hero-title" value={pageHeader.title} onChange={(e) => setPageHeader({ ...pageHeader, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input id="hero-subtitle" value={pageHeader.subtitle} onChange={(e) => setPageHeader({ ...pageHeader, subtitle: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleSaveHero} size="sm">Save Hero</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {sortedReservations.length > 0 ? (
          sortedReservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{reservation.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{reservation.id}</p>
                  </div>
                  <Badge className={getStatusColor(reservation.status)}>{reservation.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{reservation.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{reservation.phone}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium">{reservation.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-medium">{reservation.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Guests</p>
                      <p className="text-sm font-medium">{reservation.guests}</p>
                    </div>
                  </div>
                </div>

                {reservation.specialRequests && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Special Requests</p>
                    <p className="text-sm">{reservation.specialRequests}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground">Created: {new Date(reservation.createdAt).toLocaleString()}</div>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" onClick={() => handlePrint(reservation)} className="gap-2">
                      <Printer className="h-4 w-4" /> Print
                    </Button>

                    <Select value={reservation.status} onValueChange={(value: Reservation['status']) => handleStatusChange(reservation.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="destructive" size="sm" onClick={() => handleDelete(reservation.id, reservation.name)} className="gap-2">
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No reservations yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReservationManagement;
import { useRestaurant } from '@/context/RestaurantContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Trash2, Calendar, Clock, Users, Printer } from 'lucide-react';
import { Reservation } from '@/context/RestaurantContext';
import heroImage from '@/assets/hero-restaurant.jpg';

const ReservationManagement = () => {
  const { reservations, updateReservationStatus, deleteReservation, setHeroImage, heroTexts, setHeroText } = useRestaurant();
  const { toast } = useToast();

  const [pageHeader, setPageHeader] = useState({
    title: heroTexts?.reservations?.title || 'Reservations',
    subtitle: heroTexts?.reservations?.subtitle || '',
  });

  // Hero image editing state
  const [heroImgPreview, setHeroImgPreview] = useState<string | null>(null);
  const [heroImgFile, setHeroImgFile] = useState<File | null>(null);

  const handleHeroImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setHeroImgPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveHero = () => {
    if (heroImgPreview) setHeroImage('reservations', heroImgPreview);
    setHeroText('reservations', { title: pageHeader.title, subtitle: pageHeader.subtitle });
    toast({ title: 'Hero saved', description: 'Reservations hero image and text updated.' });
  };

  const handlePrint = (reservation: Reservation) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const printContent = `<html><body><h1>Reservation - ${reservation.name}</h1><pre>${JSON.stringify(reservation, null, 2)}</pre></body></html>`;
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleStatusChange = (id: string, newStatus: Reservation['status']) => {
    updateReservationStatus(id, newStatus);
    toast({ title: 'Status updated', description: 'Reservation status has been updated successfully.' });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the reservation for ${name}?`)) {
      deleteReservation(id);
      toast({ title: 'Reservation deleted', description: 'The reservation has been removed.' });
    }
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const sortedReservations = [...reservations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative -mx-6 -mt-6 mb-8 overflow-hidden rounded-b-xl">
        <div className="h-48 relative">
          <img src={heroImgPreview || heroImage} alt="Reservations hero preview" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-10">
            <h1 className="text-4xl font-bold text-white mb-2">Reservation Management</h1>
            <p className="text-white/90">View and manage table reservations</p>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Image</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="hero-image">Hero Image</Label>
          <Input type="file" id="hero-image" accept="image/*" onChange={handleHeroImgChange} />
          {heroImgPreview && <img src={heroImgPreview} className="mt-2 h-32 rounded shadow" alt="Hero Preview" />}
        </CardContent>
      </Card>

      {/* Page Header */}
      <Card>
        <CardHeader>
          <CardTitle>Page Header</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hero-title">Title</Label>
              <Input id="hero-title" value={pageHeader.title} onChange={(e) => setPageHeader({ ...pageHeader, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input id="hero-subtitle" value={pageHeader.subtitle} onChange={(e) => setPageHeader({ ...pageHeader, subtitle: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleSaveHero} size="sm">Save Hero</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {sortedReservations.length > 0 ? (
          sortedReservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{reservation.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{reservation.id}</p>
                  </div>
                  <Badge className={getStatusColor(reservation.status)}>{reservation.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{reservation.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{reservation.phone}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium">{reservation.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-medium">{reservation.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Guests</p>
                      <p className="text-sm font-medium">{reservation.guests}</p>
                    </div>
                  </div>
                </div>

                {reservation.specialRequests && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Special Requests</p>
                    <p className="text-sm">{reservation.specialRequests}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground">Created: {new Date(reservation.createdAt).toLocaleString()}</div>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" onClick={() => handlePrint(reservation)} className="gap-2">
                      <Printer className="h-4 w-4" /> Print
                    </Button>

                    <Select
                      value={reservation.status}
                      onValueChange={(value: Reservation['status']) => handleStatusChange(reservation.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="destructive" size="sm" onClick={() => handleDelete(reservation.id, reservation.name)} className="gap-2">
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No reservations yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReservationManagement;
import { useRestaurant } from '@/context/RestaurantContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Trash2, Calendar, Clock, Users, Printer } from 'lucide-react';
import { Reservation } from '@/context/RestaurantContext';
import heroImage from '@/assets/hero-restaurant.jpg';

const ReservationManagement = () => {
  const { reservations, updateReservationStatus, deleteReservation, setHeroImage, heroTexts, setHeroText } = useRestaurant();
  const { toast } = useToast();

  const [pageHeader, setPageHeader] = useState({
    title: heroTexts?.reservations?.title || 'Reservations',
    subtitle: heroTexts?.reservations?.subtitle || '',
  });

  // Hero image editing state
  const [heroImgPreview, setHeroImgPreview] = useState<string | null>(null);
  const [heroImgFile, setHeroImgFile] = useState<File | null>(null);

  const handleHeroImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
                    <Select
                      value={reservation.status}
                      onValueChange={(value: Reservation['status']) =>
                        handleStatusChange(reservation.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
              color: #333;
              margin-top: 0;
              font-size: 20px;
              border-bottom: 2px solid #e74c3c;
              padding-bottom: 10px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin: 15px 0;
              padding: 10px;
              background: white;
                    <Select
                      value={reservation.status}
                      onValueChange={(value: Reservation['status']) =>
                        handleStatusChange(reservation.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
              <span class="detail-label">Name:</span>
              <span class="detail-value">${reservation.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${reservation.email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">${reservation.phone}</span>
            </div>
          </div>

          <div class="section">
            <h2>Booking Information</h2>
            <div class="detail-row">
              <span class="detail-label">📅 Date:</span>
              <span class="detail-value">${reservation.date}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">🕐 Time:</span>
              <span class="detail-value">${reservation.time}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">👥 Number of Guests:</span>
              <span class="detail-value">${reservation.guests}</span>
            </div>
          </div>

          ${reservation.specialRequests ? `
          <div class="section">
            <h2>Special Requests</h2>
            <div class="detail-row">
              <span class="detail-value">${reservation.specialRequests}</span>
            </div>
          </div>
          ` : ''}

          <div class="footer">
            <p>123 Liberation Road, Accra, Ghana</p>
            <p>Phone: +233 24 123 4567 | Email: hello@oseiserwaa.com</p>
            <p style="margin-top: 20px; font-style: italic;">Thank you for choosing Osei Serwaa Kitchen!</p>
          </div>

          <div class="no-print" style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()" style="padding: 12px 30px; background: #e74c3c; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">
              Print Reservation
            </button>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleStatusChange = (id: string, newStatus: Reservation['status']) => {
    updateReservationStatus(id, newStatus);
    toast({
      title: 'Status updated',
      description: 'Reservation status has been updated successfully.',
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the reservation for ${name}?`)) {
      deleteReservation(id);
      toast({
        title: 'Reservation deleted',
        description: 'The reservation has been removed.',
      });
    }
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const sortedReservations = [...reservations].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative -mx-6 -mt-6 mb-8 overflow-hidden rounded-b-xl">
        <div className="h-48 relative">
          <img src={heroImgPreview || heroImage} alt="Reservations hero preview" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-10">
            <h1 className="text-4xl font-bold text-white mb-2">Reservation Management</h1>
            <p className="text-white/90">View and manage table reservations</p>
          </div>
        </div>
      </div>
      {/* Hero Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="hero-image">Hero Image</Label>
              <Input type="file" id="hero-image" accept="image/*" onChange={handleHeroImgChange} />
                    <Select
                      value={reservation.status}
                      onValueChange={(value: Reservation['status']) =>
                        handleStatusChange(reservation.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{reservation.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{reservation.phone}</p>
                  </div>
                </div>

                {/* Reservation Details */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium">{reservation.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-medium">{reservation.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Guests</p>
                      <p className="text-sm font-medium">{reservation.guests}</p>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {reservation.specialRequests && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Special Requests</p>
                    <p className="text-sm">{reservation.specialRequests}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(reservation.createdAt).toLocaleString()}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handlePrint(reservation)}
                      className="gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      Print
                    </Button>

                    <Select
                      value={reservation.status}
                      onValueChange={(value: Reservation['status']) =>
                        handleStatusChange(reservation.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <Card>
                          <CardHeader>
                            <CardTitle>Hero Image</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label htmlFor="hero-image">Hero Image</Label>
                              <Input type="file" id="hero-image" accept="image/*" onChange={handleHeroImgChange} />
                              {heroImgPreview && (
                                <img src={heroImgPreview} alt="Hero Preview" className="mt-2 h-32 rounded shadow" />
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Page Header (Title & Subtitle) */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Page Header</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="hero-title">Title</Label>
                                <Input
                                  id="hero-title"
                                  value={pageHeader.title}
                                  onChange={(e) => setPageHeader({ ...pageHeader, title: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="hero-subtitle">Subtitle</Label>
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
