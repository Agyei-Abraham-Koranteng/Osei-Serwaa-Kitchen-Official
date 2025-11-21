import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';

const ManageAdmins = () => {
  const restaurant = useRestaurant();
  const [admins, setAdmins] = useState([
    { id: 'admin-1', username: 'primary_admin', email: 'admin@example.com' },
  ]);
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleAdd = () => {
    if (!form.username || !form.email || !form.password) return;
    setAdmins([
      { id: `admin-${Date.now()}`, username: form.username, email: form.email },
      ...admins,
    ]);
    setForm({ username: '', email: '', password: '' });
  };

  const handleDelete = (id: string) => {
    setAdmins(admins.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Admins</h1>
        <p className="text-muted-foreground">Add, remove, or edit administrative users for the admin portal.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="admin-username">Username</Label>
              <Input id="admin-username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="admin-email">Email</Label>
              <Input id="admin-email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="admin-password">Password</Label>
              <Input id="admin-password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleAdd}>Add Admin</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {admins.map((admin) => (
          <Card key={admin.id}>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="font-medium">{admin.username}</div>
                <div className="text-sm text-muted-foreground">{admin.email}</div>
              </div>
              <div>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(admin.id)}>Remove</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageAdmins;
