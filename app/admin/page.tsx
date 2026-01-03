'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Package, RefreshCw, ShieldAlert, LogOut, CheckCircle, Truck } from 'lucide-react';
import { toast } from 'react-hot-toast';

// UI Kit
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// CHANGE THIS TO YOUR EMAIL
const ADMIN_EMAIL = "shaheenfarjo@gmail.com"; 

type Rental = {
  id: number;
  user_id: string;
  item_name: string;
  amount: number;
  status: 'active' | 'delivered' | 'returned';
  created_at: string;
};

export default function AdminDashboard() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) {
      setAuthorized(false);
      setLoading(false);
    } else {
      setAuthorized(true);
      fetchOrders();
    }
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('rentals')
      .select('*')
      .order('created_at', { ascending: false });
    
    setRentals(data || []);
    setLoading(false);
    toast.success("Data refreshed");
  };

  const updateStatus = async (id: number, newStatus: string) => {
    const { error } = await supabase.from('rentals').update({ status: newStatus }).eq('id', id);
    if (error) toast.error("Update failed");
    else {
      toast.success(`Order #${id} updated to ${newStatus}`);
      fetchOrders();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return <PageLoader />;

  // ACCESS DENIED SCREEN
  if (!authorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-4">
        <ShieldAlert className="w-24 h-24 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-brand-dark mb-2">Restricted Access</h1>
        <p className="text-slate-500 mb-8">This area is for IDEA HQ staff only.</p>
        <Button onClick={() => router.push('/')} variant="dark">Return to Safety</Button>
      </div>
    );
  }

  // THE DASHBOARD
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 pt-28">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-dark">Operations Command</h1>
            <p className="text-slate-500">Manage active deliveries and returns.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => fetchOrders}>
              <RefreshCw size={18} className="mr-2" /> Refresh
            </Button>
            <Button variant="ghost" onClick={() => setShowLogout(true)}>
              <LogOut size={18} />
            </Button>
          </div>
        </div>

        {/* Orders Table Card */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-semibold text-slate-600">ID</th>
                  <th className="p-4 font-semibold text-slate-600">Item</th>
                  <th className="p-4 font-semibold text-slate-600">Status</th>
                  <th className="p-4 font-semibold text-slate-600">Time</th>
                  <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rentals.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-sm text-slate-500">#{order.id}</td>
                    <td className="p-4 font-bold text-brand-dark">{order.item_name}</td>
                    <td className="p-4">
                      <Badge variant={
                        order.status === 'active' ? 'warning' :
                        order.status === 'delivered' ? 'success' :
                        'neutral'
                      }>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      {order.status === 'active' && (
                        <Button 
                          onClick={() => updateStatus(order.id, 'delivered')}
                          className="h-8 px-3 text-xs"
                          variant="dark"
                        >
                          <Truck size={14} className="mr-1" /> Mark Delivered
                        </Button>
                      )}
                      {order.status === 'delivered' && (
                        <Button 
                          onClick={() => updateStatus(order.id, 'returned')}
                          className="h-8 px-3 text-xs"
                          variant="outline"
                        >
                          <CheckCircle size={14} className="mr-1" /> Confirm Return
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {rentals.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <Package size={48} className="mx-auto mb-4 opacity-50" />
              All quiet on the western front.
            </div>
          )}
        </Card>

        {/* Logout Modal */}
        <Modal 
          isOpen={showLogout} 
          onClose={() => setShowLogout(false)} 
          title="End Shift?"
        >
          <p className="text-slate-600 mb-6">Are you sure you want to log out of the command center?</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowLogout(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleLogout}>Log Out</Button>
          </div>
        </Modal>

      </div>
    </div>
  );
}
