import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllAgencies } from '@/lib/database';
import { Building2, Mail, Phone, MapPin, User } from 'lucide-react';

export default async function AgenciesPage() {
  const agencies = await getAllAgencies();

  return (
    <main className="flex-1">
      <div className="container mx-auto space-y-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold">
              <Building2 className="h-8 w-8 text-blue-600" />
              Travel Agencies
            </h1>
            <p className="text-muted-foreground">Directory of registered travel agencies</p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {agencies.length} Agencies
          </Badge>
        </div>

        {/* Agencies Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agencies.map((agency) => (
            <Card key={agency.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="h-5 w-5" />
                      {agency.first_name} {agency.last_name}
                    </CardTitle>
                    <p className="text-sm font-medium text-muted-foreground">
                      {agency.company_name}
                    </p>
                  </div>
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Company Address */}
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <div className="text-sm">
                    <p>{agency.company_address}</p>
                    <p>
                      {agency.company_zip_code} {agency.company_city}
                    </p>
                    <p className="font-medium">{agency.company_country}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${agency.email}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {agency.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${agency.telephone}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {agency.telephone}
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    Contact
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {agencies.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No agencies found</h3>
              <p className="text-muted-foreground">
                Travel agencies will appear here once registered
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
