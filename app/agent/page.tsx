import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  Award,
  Plane,
  Plus,
  Eye,
  FileText,
  Globe,
} from 'lucide-react';
import { redirect } from 'next/navigation';

async function getAllAgentsWithAgencies() {
  const supabase = createClient();

  // First try the relationship query using the new agency_id foreign key
  let { data, error } = await supabase
    .from('agents')
    .select(
      `
      *,
      agencies!agency_id (
        id,
        name,
        city,
        country,
        email,
        telephone,
        zip_code,
        is_active
      )
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Relationship query failed:', error);

    // Fallback: Use denormalized data
    const { data: agentsData, error: fallbackError } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });

    if (fallbackError) {
      console.error('Error fetching agents (fallback):', fallbackError);
      return [];
    }

    // Map denormalized data to expected structure
    return (agentsData || []).map((agent) => ({
      ...agent,
      agencies: agent.agency_name
        ? {
            id: agent.agency_id || '',
            name: agent.agency_name,
            city: agent.agency_city,
            country: agent.agency_country,
            email: agent.agency_email,
            telephone: agent.agency_telephone,
            zip_code: agent.agency_zip_code,
            is_active: true, // Default since we don't store this denormalized
            address: agent.agency_address || '',
          }
        : null,
    }));
  }

  return data || [];
}

async function getAgentStats() {
  const supabase = createClient();

  try {
    const [{ count: totalAgents }, { count: activeAgents }] = await Promise.all([
      supabase.from('agents').select('*', { count: 'exact', head: true }),
      supabase.from('agents').select('*', { count: 'exact', head: true }).eq('is_active', true),
    ]);

    // Get agents data to check agency assignments
    const { data: agentsData } = await supabase.from('agents').select('id, agency_id');

    const agentsWithAgencies = agentsData?.filter((agent) => agent.agency_id).length || 0;
    const unassignedAgents = (totalAgents || 0) - agentsWithAgencies;

    // Get this month's registrations
    const thisMonth = new Date();
    thisMonth.setDate(1);

    const { count: thisMonthAgents } = await supabase
      .from('agents')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thisMonth.toISOString());

    return {
      totalAgents: totalAgents || 0,
      activeAgents: activeAgents || 0,
      agentsWithAgencies,
      unassignedAgents,
      thisMonthAgents: thisMonthAgents || 0,
    };
  } catch (error) {
    console.error('Error fetching agent stats:', error);
    return {
      totalAgents: 0,
      activeAgents: 0,
      agentsWithAgencies: 0,
      unassignedAgents: 0,
      thisMonthAgents: 0,
    };
  }
}

export default async function AgentPage() {
  const [agents, stats] = await Promise.all([getAllAgentsWithAgencies(), getAgentStats()]);

  return (
    <main className="flex-1">
      <div className="container mx-auto space-y-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold">
              <Users className="h-8 w-8 text-green-600" />
              Travel Agents Directory
            </h1>
            <p className="text-muted-foreground">
              Manage and view all registered travel agents and their agency assignments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              {stats.totalAgents} Total Agents
            </Badge>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Agent
            </Button>
          </div>
        </div>

        {/* Agent Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAgents}</div>
              <p className="text-xs text-muted-foreground">{stats.activeAgents} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Agencies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.agentsWithAgencies}</div>
              <p className="text-xs text-muted-foreground">Properly assigned</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.unassignedAgents}</div>
              <p className="text-xs text-muted-foreground">Need assignment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.thisMonthAgents}</div>
              <p className="text-xs text-muted-foreground">New registrations</p>
            </CardContent>
          </Card>
        </div>

        {/* Debug info - remove this in production */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-sm">Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Found {agents.length} agents, {agents.filter((a) => a.agencies).length} with
                agencies
              </p>
            </CardContent>
          </Card>
        )}

        {/* Agents Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Agents</TabsTrigger>
            <TabsTrigger value="assigned">With Agencies</TabsTrigger>
            <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>

          {/* All Agents Tab */}
          <TabsContent value="all" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Travel Agents</h2>
              <Badge variant="secondary">{agents.length} agents found</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => (
                <Card key={agent.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <User className="h-5 w-5" />
                          {agent.first_name} {agent.last_name}
                        </CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Agent ID: {agent.id.substring(0, 8)}...
                        </p>
                      </div>
                      <Badge
                        variant={agent.is_active ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {agent.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Agency Information */}
                    {agent.agencies ? (
                      <div className="rounded-md border border-green-200 bg-green-50 p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Assigned Agency
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-green-900">{agent.agencies.name}</p>
                          <p className="text-sm text-green-700">
                            {agent.agencies.city}, {agent.agencies.country}
                          </p>
                          {agent.agencies.email && (
                            <p className="text-sm text-green-700">{agent.agencies.email}</p>
                          )}
                          <Badge
                            variant={agent.agencies.is_active ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {agent.agencies.is_active ? 'Active Agency' : 'Inactive Agency'}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-md border border-orange-200 bg-orange-50 p-3">
                        <div className="mb-1 flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-800">
                            No Agency Assigned
                          </span>
                        </div>
                        <p className="text-sm text-orange-700">
                          This agent needs to be assigned to an agency
                        </p>
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${agent.email}`}
                          className="truncate text-sm text-blue-600 hover:underline"
                        >
                          {agent.email}
                        </a>
                      </div>
                      {agent.telephone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`tel:${agent.telephone}`}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {agent.telephone}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Registration Date */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Registered {new Date(agent.created_at).toLocaleDateString()}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      {!agent.agencies ? (
                        <Button size="sm" className="flex-1">
                          <Building2 className="mr-2 h-4 w-4" />
                          Assign Agency
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="flex-1">
                          <Mail className="mr-2 h-4 w-4" />
                          Contact
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {agents.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">No agents found</h3>
                  <p className="text-muted-foreground">
                    Travel agents will appear here once registered
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Assigned Agents Tab */}
          <TabsContent value="assigned" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Agents with Agency Assignments</h2>
              <Badge variant="secondary">{agents.filter((a) => a.agencies).length} assigned</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {agents
                .filter((agent) => agent.agencies)
                .map((agent) => (
                  <Card key={agent.id} className="transition-shadow hover:shadow-md">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-5 w-5" />
                        {agent.first_name} {agent.last_name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="rounded-md bg-green-50 p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Agency</span>
                        </div>
                        <p className="font-medium">{agent.agencies?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {agent.agencies?.city}, {agent.agencies?.country}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          View Dashboard
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Unassigned Agents Tab */}
          <TabsContent value="unassigned" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Unassigned Agents</h2>
              <Badge variant="destructive">
                {agents.filter((a) => !a.agencies).length} need assignment
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {agents
                .filter((agent) => !agent.agencies)
                .map((agent) => (
                  <Card key={agent.id} className="border-orange-200 bg-orange-50/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-5 w-5" />
                        {agent.first_name} {agent.last_name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="rounded-md border border-orange-200 bg-orange-100 p-3">
                        <div className="mb-1 flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-800">No Agency</span>
                        </div>
                        <p className="text-sm text-orange-700">
                          This agent needs to be assigned to an agency
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate text-sm">{agent.email}</span>
                        </div>
                        {agent.telephone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{agent.telephone}</span>
                          </div>
                        )}
                      </div>

                      <Button size="sm" className="w-full">
                        <Building2 className="mr-2 h-4 w-4" />
                        Assign to Agency
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {agents.filter((a) => !a.agencies).length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Building2 className="mx-auto mb-4 h-12 w-12 text-green-600" />
                  <h3 className="text-lg font-semibold">All agents are assigned!</h3>
                  <p className="text-muted-foreground">
                    Every agent has been properly assigned to an agency
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Inactive Agents Tab */}
          <TabsContent value="inactive" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Inactive Agents</h2>
              <Badge variant="secondary">
                {agents.filter((a) => !a.is_active).length} inactive
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {agents
                .filter((agent) => !agent.is_active)
                .map((agent) => (
                  <Card key={agent.id} className="opacity-75">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <User className="h-5 w-5" />
                          {agent.first_name} {agent.last_name}
                        </CardTitle>
                        <Badge variant="secondary">Inactive</Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {agent.agencies && (
                        <div className="rounded-md bg-gray-100 p-3">
                          <p className="text-sm font-medium">{agent.agencies.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {agent.agencies.city}, {agent.agencies.country}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <User className="mr-2 h-4 w-4" />
                          Reactivate
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {agents.filter((a) => !a.is_active).length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="mx-auto mb-4 h-12 w-12 text-green-600" />
                  <h3 className="text-lg font-semibold">All agents are active!</h3>
                  <p className="text-muted-foreground">No inactive agents found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
