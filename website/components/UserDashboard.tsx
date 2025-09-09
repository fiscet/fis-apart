/* eslint-disable */
// @ts-nocheck
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Calendar, 
  BarChart3, 
  Mail, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Building,
  CalendarCheck,
  Euro
} from "lucide-react";
import type { Property, Booking } from "@shared/schema";

export function UserDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['/api/properties/owner', user?.id],
    enabled: !!user && (user.role === 'owner' || user.role === 'admin'),
  });

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
    enabled: !!user,
  });

  if (!user) return null;

  const stats = {
    totalProperties: properties.length,
    activeBookings: bookings.filter(b => b.status === 'confirmed').length,
    monthlyRevenue: bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + parseFloat(b.totalPrice), 0),
  };

  return (
    <section className="py-16 px-4" data-testid="section-dashboard">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.profileImageUrl || undefined} />
                    <AvatarFallback>
                      {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold" data-testid="text-user-name">
                      {user.firstName} {user.lastName}
                    </h4>
                    <p className="text-sm text-muted-foreground capitalize" data-testid="text-user-role">
                      {user.role}
                    </p>
                  </div>
                </div>
                
                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start bg-primary/10 text-primary" data-testid="nav-apartments">
                    <Home className="mr-3 h-4 w-4" />
                    {t('myApartments')}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" data-testid="nav-bookings">
                    <Calendar className="mr-3 h-4 w-4" />
                    {t('bookings')}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" data-testid="nav-statistics">
                    <BarChart3 className="mr-3 h-4 w-4" />
                    {t('statistics')}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" data-testid="nav-messages">
                    <Mail className="mr-3 h-4 w-4" />
                    {t('messages')}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" data-testid="nav-profile">
                    <Settings className="mr-3 h-4 w-4" />
                    {t('profile')}
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Content */}
          <div className="lg:col-span-3">
            {/* Stats Overview */}
            {(user.role === 'owner' || user.role === 'admin') && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">{t('totalProperties')}</p>
                        <p className="text-2xl font-bold" data-testid="stat-total-properties">{stats.totalProperties}</p>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building className="text-primary h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">{t('activeBookings')}</p>
                        <p className="text-2xl font-bold" data-testid="stat-active-bookings">{stats.activeBookings}</p>
                      </div>
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <CalendarCheck className="text-accent h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">{t('monthlyRevenue')}</p>
                        <p className="text-2xl font-bold" data-testid="stat-monthly-revenue">€{stats.monthlyRevenue.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <Euro className="text-green-600 dark:text-green-400 h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Properties Management */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xl font-bold">{t('myApartments')}</h4>
                  {(user.role === 'owner' || user.role === 'admin') && (
                    <Button className="bg-primary text-primary-foreground" data-testid="button-new-property">
                      <Plus className="mr-2 h-4 w-4" />
                      {t('newProperty')}
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {properties.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground" data-testid="text-no-properties">
                      Még nem adott hozzá apartmant.
                    </div>
                  ) : (
                    properties.map((property) => (
                      <div
                        key={property.id}
                        className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                        data-testid={`property-item-${property.id}`}
                      >
                        <img 
                          src={property.mainImageUrl || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=200&h=150"} 
                          alt="Apartman kép"
                          className="w-16 h-16 object-cover rounded-lg"
                          data-testid={`img-property-${property.id}`}
                        />
                        <div className="flex-1">
                          <h5 className="font-semibold" data-testid={`text-property-name-${property.id}`}>{property.name}</h5>
                          <p className="text-sm text-muted-foreground" data-testid={`text-property-details-${property.id}`}>
                            {property.city}, {property.region} • €{property.lowSeasonPrice}/éjszaka
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant={property.isActive ? "default" : "secondary"} data-testid={`badge-status-${property.id}`}>
                              {property.isActive ? t('active') : 'Inaktív'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon" data-testid={`button-edit-${property.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" data-testid={`button-delete-${property.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
