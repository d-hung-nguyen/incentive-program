'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Shield,
  Users,
  Building2,
  Hotel,
  Calendar,
  TrendingUp,
  Award,
  DollarSign,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  MoreHorizontal,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
} from 'lucide-react';

// Import the interfaces from the server component
interface AdminAgency {
  id: string;
  name?: string;
  company_name?: string;
  city?: string;
  company_city?: string;
  country?: string;
  company_country?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  telephone?: string;
  company_type?: string;
  iata_code?: string;
  is_active: boolean;
  created_at: string;
}

interface AdminAgent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  telephone: string;
  is_active: boolean;
  created_at: string;
  agencies?: Array<{
    id: string;
    name: string;
    city: string;
    country: string;
  }>;
}

interface AdminHotel {
  id: string;
  hotel_name: string;
  location_city: string;
  location_country: string;
  star_rating?: number;
  contact_phone?: string;
  contact_email?: string;
  is_active: boolean;
  created_at: string;
}

interface AdminBooking {
  id: string;
  guest_name: string;
  guest_email?: string;
  arrival_date: string;
  number_of_nights?: number;
  booking_status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  total_amount?: number;
  created_at: string;
  confirmation_number?: string;
  hotels?: {
    hotel_name: string;
  };
  agencies?: {
    company_name?: string;
    name?: string;
  };
}

interface AdminDashboardData {
  agencies: AdminAgency[];
  agents: AdminAgent[];
  hotels: AdminHotel[];
  bookings: AdminBooking[];
}

// Filter and search components
interface FilterableTableProps<T> {
  data: T[];
  searchPlaceholder: string;
  renderRow: (item: T) => React.ReactNode;
  filterOptions: Array<{
    key: string;
    label: string;
    options: Array<{ value: string; label: string }>;
  }>;
  searchableFields: Array<keyof T>;
  headers: string[];
  itemsPerPage?: number;
  exportFilename?: string;
  exportFields?: Array<{
    key: keyof T;
    label: string;
    formatter?: (value: any) => string;
  }>;
  onStatusToggle?: (id: string, currentStatus: boolean) => Promise<void>;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onBulkAction?: (action: string, selectedIds: string[]) => Promise<void>;
  bulkActions?: Array<{
    label: string;
    action: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline';
  }>;
}

function FilterableTable<T>({
  data,
  searchPlaceholder,
  renderRow,
  filterOptions,
  searchableFields,
  headers,
  itemsPerPage = 10,
  exportFilename = 'export',
  exportFields,
  onStatusToggle,
  onEdit,
  onView,
  onBulkAction,
  bulkActions,
}: FilterableTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isPerformingBulkAction, setIsPerformingBulkAction] = useState(false);

  const filteredData = useMemo(() => {
    let result = data;

    // Apply search filter
    if (searchTerm) {
      result = result.filter((item) =>
        searchableFields.some((field) => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply dropdown filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((item) => {
          const itemValue = (item as any)[key];
          return (
            itemValue === value ||
            (typeof itemValue === 'boolean' && itemValue.toString() === value)
          );
        });
      }
    });

    return result;
  }, [data, searchTerm, filters, searchableFields]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // Pagination calculations
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Export functions
  const exportToCSV = () => {
    if (!exportFields) return;

    const csvContent = [
      // Header row
      exportFields.map((field) => field.label).join(','),
      // Data rows
      ...filteredData.map((item) =>
        exportFields
          .map((field) => {
            const value = item[field.key];
            const formattedValue = field.formatter ? field.formatter(value) : String(value || '');
            // Escape commas and quotes in CSV
            return `"${formattedValue.replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `${exportFilename}-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    if (!exportFields) return;

    // Simple TSV format that Excel can open
    const tsvContent = [
      // Header row
      exportFields.map((field) => field.label).join('\t'),
      // Data rows
      ...filteredData.map((item) =>
        exportFields
          .map((field) => {
            const value = item[field.key];
            const formattedValue = field.formatter ? field.formatter(value) : String(value || '');
            return formattedValue.replace(/\t/g, ' '); // Replace tabs with spaces
          })
          .join('\t')
      ),
    ].join('\n');

    const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `${exportFilename}-${new Date().toISOString().split('T')[0]}.xlsx`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk action functions
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = paginatedData.map((item: any) => item.id);
      setSelectedItems(new Set(allIds));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkAction = async (action: string) => {
    if (!onBulkAction || selectedItems.size === 0) return;

    setIsPerformingBulkAction(true);
    try {
      await onBulkAction(action, Array.from(selectedItems));
      setSelectedItems(new Set());
    } catch (error) {
      console.error('Error performing bulk action:', error);
    } finally {
      setIsPerformingBulkAction(false);
    }
  };

  const isAllSelected =
    paginatedData.length > 0 && paginatedData.every((item: any) => selectedItems.has(item.id));
  const isIndeterminate = selectedItems.size > 0 && !isAllSelected;

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {filterOptions.map((option) => (
            <Select
              key={option.key}
              value={filters[option.key] || ''}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, [option.key]: value }))}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={option.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All {option.label}</SelectItem>
                {option.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
          {exportFields && (
            <>
              <Button variant="outline" onClick={exportToCSV} size="sm">
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button variant="outline" onClick={exportToExcel} size="sm">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Excel
              </Button>
            </>
          )}
          {(searchTerm || Object.values(filters).some(Boolean)) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setFilters({});
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {bulkActions && selectedItems.size > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
          <span className="text-sm font-medium text-blue-900">
            {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
          </span>
          <div className="ml-auto flex gap-2">
            {bulkActions.map((action) => (
              <Button
                key={action.action}
                variant={action.variant || 'outline'}
                size="sm"
                onClick={() => handleBulkAction(action.action)}
                disabled={isPerformingBulkAction}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setSelectedItems(new Set())}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
          {totalItems !== data.length && ` (filtered from ${data.length} total)`}
        </div>
        {totalPages > 1 && (
          <div>
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {bulkActions && (
                  <TableHead className="w-[50px]">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border border-gray-300"
                    />
                  </TableHead>
                )}
                {headers.map((header) => (
                  <TableHead key={header} className={header === 'Actions' ? 'w-[80px]' : ''}>
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => {
                  const row = renderRow(item);
                  if (bulkActions && React.isValidElement(row)) {
                    const itemId = (item as any).id;
                    const children = React.Children.toArray(row.props.children);
                    return React.cloneElement(
                      row,
                      {
                        key: row.key || itemId,
                      },
                      // Children should be passed as the third argument, not as a prop
                      <TableCell key="checkbox" className="w-[50px]">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(itemId)}
                          onChange={(e) => handleSelectItem(itemId, e.target.checked)}
                          className="rounded border border-gray-300"
                        />
                      </TableCell>,
                      ...children
                    );
                  }
                  return row;
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={bulkActions ? headers.length + 1 : headers.length}
                    className="py-8 text-center"
                  >
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));

              if (pageNumber > totalPages) return null;

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => goToPage(pageNumber)}
                  className="w-10"
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Action menu component for admin actions
interface ActionMenuProps {
  itemId: string;
  isActive: boolean;
  onStatusToggle?: (id: string, currentStatus: boolean) => Promise<void>;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
}

function ActionMenu({ itemId, isActive, onStatusToggle, onEdit, onView }: ActionMenuProps) {
  const [isToggling, setIsToggling] = useState(false);

  const handleStatusToggle = async () => {
    if (!onStatusToggle) return;

    setIsToggling(true);
    try {
      await onStatusToggle(itemId, isActive);
    } catch (error) {
      console.error('Error toggling status:', error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onView && (
          <>
            <DropdownMenuItem onClick={() => onView(itemId)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(itemId)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {onStatusToggle && (
          <DropdownMenuItem onClick={handleStatusToggle} disabled={isToggling}>
            {isActive ? (
              <>
                <UserX className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface AdminDashboardClientProps {
  initialData: AdminDashboardData;
  user: { email: string };
}

export default function AdminDashboardClient({ initialData, user }: AdminDashboardClientProps) {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData>(initialData);

  // Admin action functions
  const handleAgencyStatusToggle = async (agencyId: string, currentStatus: boolean) => {
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('agencies')
        .update({ is_active: !currentStatus })
        .eq('id', agencyId);

      if (error) throw error;

      // Update local state
      setDashboardData((prev) => ({
        ...prev,
        agencies: prev.agencies.map((agency) =>
          agency.id === agencyId ? { ...agency, is_active: !currentStatus } : agency
        ),
      }));
    } catch (error) {
      console.error('Error updating agency status:', error);
      throw error;
    }
  };

  const handleAgentStatusToggle = async (agentId: string, currentStatus: boolean) => {
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('agents')
        .update({ is_active: !currentStatus })
        .eq('id', agentId);

      if (error) throw error;

      // Update local state
      setDashboardData((prev) => ({
        ...prev,
        agents: prev.agents.map((agent) =>
          agent.id === agentId ? { ...agent, is_active: !currentStatus } : agent
        ),
      }));
    } catch (error) {
      console.error('Error updating agent status:', error);
      throw error;
    }
  };

  const handleHotelStatusToggle = async (hotelId: string, currentStatus: boolean) => {
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('hotels')
        .update({ is_active: !currentStatus })
        .eq('id', hotelId);

      if (error) throw error;

      // Update local state
      setDashboardData((prev) => ({
        ...prev,
        hotels: prev.hotels.map((hotel) =>
          hotel.id === hotelId ? { ...hotel, is_active: !currentStatus } : hotel
        ),
      }));
    } catch (error) {
      console.error('Error updating hotel status:', error);
      throw error;
    }
  };

  const {
    agencies: allAgencies,
    hotels: allHotels,
    bookings: allBookings,
    agents: allAgents,
  } = dashboardData;

  const totalAgencies = allAgencies.length;
  const activeAgencies = allAgencies.filter((agency) => agency.is_active).length;
  const totalHotels = allHotels.length;
  const totalBookings = allBookings.length;
  const thisMonthBookings = allBookings.filter(
    (booking) => new Date(booking.created_at).getMonth() === new Date().getMonth()
  ).length;
  const totalRevenue = allBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);

  // Enhanced analytics calculations
  const thisMonthRevenue = allBookings
    .filter((booking) => new Date(booking.created_at).getMonth() === new Date().getMonth())
    .reduce((sum, booking) => sum + (booking.total_amount || 0), 0);

  const lastMonthBookings = allBookings.filter((booking) => {
    const bookingMonth = new Date(booking.created_at).getMonth();
    const lastMonth = new Date().getMonth() === 0 ? 11 : new Date().getMonth() - 1;
    return bookingMonth === lastMonth;
  }).length;

  const activeHotels = allHotels.filter((hotel) => hotel.is_active).length;
  const totalActiveUsers = activeAgencies + allAgents.filter((agent) => agent.is_active).length;

  const bookingStatusCounts = {
    confirmed: allBookings.filter((b) => b.booking_status === 'confirmed').length,
    pending: allBookings.filter((b) => b.booking_status === 'pending').length,
    cancelled: allBookings.filter((b) => b.booking_status === 'cancelled').length,
    completed: allBookings.filter((b) => b.booking_status === 'completed').length,
  };

  const growthRate =
    lastMonthBookings > 0 ? ((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100 : 0;

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <Shield className="h-8 w-8 text-red-600" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">System Administrator - {user.email}</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          ADMIN ACCESS
        </Badge>
      </div>

      {/* Admin Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agencies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgencies}</div>
            <p className="text-xs text-muted-foreground">{activeAgencies} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hotels</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHotels}</div>
            <p className="text-xs text-muted-foreground">Partner hotels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">{thisMonthBookings} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              €{totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total platform revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agencies">Agencies</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Enhanced Analytics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {growthRate >= 0 ? '+' : ''}
                  {growthRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  vs last month ({lastMonthBookings} bookings)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  €{thisMonthRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">This month&apos;s revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalActiveUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {activeAgencies} agencies, {allAgents.filter((a) => a.is_active).length} agents
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Hotels</CardTitle>
                <Hotel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeHotels}</div>
                <p className="text-xs text-muted-foreground">of {totalHotels} total hotels</p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Charts and Insights */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Booking Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Confirmed</span>
                      <span className="text-sm text-muted-foreground">
                        {bookingStatusCounts.confirmed} (
                        {((bookingStatusCounts.confirmed / totalBookings) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <Progress
                      value={(bookingStatusCounts.confirmed / totalBookings) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Completed</span>
                      <span className="text-sm text-muted-foreground">
                        {bookingStatusCounts.completed} (
                        {((bookingStatusCounts.completed / totalBookings) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <Progress
                      value={(bookingStatusCounts.completed / totalBookings) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pending</span>
                      <span className="text-sm text-muted-foreground">
                        {bookingStatusCounts.pending} (
                        {((bookingStatusCounts.pending / totalBookings) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <Progress
                      value={(bookingStatusCounts.pending / totalBookings) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cancelled</span>
                      <span className="text-sm text-muted-foreground">
                        {bookingStatusCounts.cancelled} (
                        {((bookingStatusCounts.cancelled / totalBookings) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <Progress
                      value={(bookingStatusCounts.cancelled / totalBookings) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Status</span>
                    <Badge variant="default" className="bg-green-600">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Status</span>
                    <Badge variant="default" className="bg-green-600">
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup Status</span>
                    <Badge variant="default" className="bg-green-600">
                      Current
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime</span>
                    <span className="text-sm font-medium">99.9%</span>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="mb-3 text-sm font-medium">Recent Activity</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">New registrations</span>
                        <Badge variant="outline" className="text-xs">
                          +{activeAgencies}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Active sessions</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(totalActiveUsers * 0.7)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Agencies Tab */}
        <TabsContent value="agencies" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Travel Agencies</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Agency
            </Button>
          </div>

          <FilterableTable
            data={allAgencies}
            searchPlaceholder="Search agencies by name, email, or location..."
            searchableFields={[
              'company_name',
              'name',
              'email',
              'first_name',
              'last_name',
              'company_city',
              'city',
              'company_country',
              'country',
            ]}
            headers={[
              'Agency ID',
              'Company Name',
              'Contact Person',
              'Location',
              'Type',
              'Status',
              'Actions',
            ]}
            exportFilename="agencies"
            exportFields={[
              { key: 'id', label: 'Agency ID' },
              { key: 'company_name', label: 'Company Name', formatter: (value) => value || 'N/A' },
              {
                key: 'first_name',
                label: 'Contact First Name',
                formatter: (value) => value || 'N/A',
              },
              {
                key: 'last_name',
                label: 'Contact Last Name',
                formatter: (value) => value || 'N/A',
              },
              { key: 'email', label: 'Email', formatter: (value) => value || 'N/A' },
              { key: 'telephone', label: 'Phone', formatter: (value) => value || 'N/A' },
              { key: 'company_city', label: 'City', formatter: (value) => value || 'N/A' },
              { key: 'company_country', label: 'Country', formatter: (value) => value || 'N/A' },
              { key: 'company_type', label: 'Type', formatter: (value) => value || 'Agency' },
              {
                key: 'is_active',
                label: 'Status',
                formatter: (value) => (value ? 'Active' : 'Inactive'),
              },
              {
                key: 'created_at',
                label: 'Created Date',
                formatter: (value) => new Date(value).toLocaleDateString(),
              },
            ]}
            onStatusToggle={handleAgencyStatusToggle}
            onBulkAction={async (action, selectedIds) => {
              console.log('Bulk action:', action, 'on agencies:', selectedIds);
              // Implement bulk actions here
              if (action === 'activate') {
                for (const id of selectedIds) {
                  await handleAgencyStatusToggle(id, false);
                }
              } else if (action === 'deactivate') {
                for (const id of selectedIds) {
                  await handleAgencyStatusToggle(id, true);
                }
              }
            }}
            bulkActions={[
              {
                label: 'Activate Selected',
                action: 'activate',
                icon: <UserCheck className="h-4 w-4" />,
                variant: 'default',
              },
              {
                label: 'Deactivate Selected',
                action: 'deactivate',
                icon: <UserX className="h-4 w-4" />,
                variant: 'destructive',
              },
            ]}
            filterOptions={[
              {
                key: 'is_active',
                label: 'Status',
                options: [
                  { value: 'true', label: 'Active' },
                  { value: 'false', label: 'Inactive' },
                ],
              },
              {
                key: 'company_type',
                label: 'Type',
                options: [
                  { value: 'Agency', label: 'Agency' },
                  { value: 'Tour Operator', label: 'Tour Operator' },
                  { value: 'Travel Management', label: 'Travel Management' },
                ],
              },
            ]}
            renderRow={(agency) => (
              <TableRow key={agency.id}>
                <TableCell className="font-medium">
                  #{agency.id.toString().padStart(4, '0')}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{agency.company_name || agency.name}</p>
                    <p className="text-sm text-muted-foreground">{agency.iata_code || 'N/A'}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {agency.first_name || 'N/A'} {agency.last_name || ''}
                    </p>
                    <p className="text-sm text-muted-foreground">{agency.email || 'N/A'}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{agency.company_city || agency.city}</p>
                    <p className="text-sm text-muted-foreground">
                      {agency.company_country || agency.country}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{agency.company_type || 'Agency'}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={agency.is_active ? 'default' : 'secondary'}>
                    {agency.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ActionMenu
                    itemId={agency.id}
                    isActive={agency.is_active}
                    onStatusToggle={handleAgencyStatusToggle}
                    onView={(id) => console.log('View agency:', id)}
                  />
                </TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Travel Agents</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Agent
            </Button>
          </div>

          <FilterableTable
            data={allAgents}
            searchPlaceholder="Search agents by name, email, or agency..."
            searchableFields={['first_name', 'last_name', 'email', 'telephone']}
            headers={['Agent ID', 'Name', 'Email', 'Phone', 'Agency', 'Status', 'Actions']}
            exportFilename="agents"
            exportFields={[
              { key: 'id', label: 'Agent ID' },
              { key: 'first_name', label: 'First Name' },
              { key: 'last_name', label: 'Last Name' },
              { key: 'email', label: 'Email' },
              { key: 'telephone', label: 'Phone' },
              {
                key: 'is_active',
                label: 'Status',
                formatter: (value) => (value ? 'Active' : 'Inactive'),
              },
              {
                key: 'created_at',
                label: 'Created Date',
                formatter: (value) => new Date(value).toLocaleDateString(),
              },
            ]}
            onStatusToggle={handleAgentStatusToggle}
            filterOptions={[
              {
                key: 'is_active',
                label: 'Status',
                options: [
                  { value: 'true', label: 'Active' },
                  { value: 'false', label: 'Inactive' },
                ],
              },
            ]}
            renderRow={(agent) => (
              <TableRow key={agent.id}>
                <TableCell className="font-medium">
                  #{agent.id.toString().substring(0, 8)}
                </TableCell>
                <TableCell>
                  <p className="font-medium">
                    {agent.first_name} {agent.last_name}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{agent.email}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{agent.telephone}</p>
                </TableCell>
                <TableCell>
                  {agent.agencies && agent.agencies.length > 0 ? (
                    <div>
                      <p className="font-medium">{agent.agencies[0].name}</p>
                      <p className="text-sm text-muted-foreground">
                        {agent.agencies[0].city}, {agent.agencies[0].country}
                      </p>
                    </div>
                  ) : (
                    <Badge variant="outline">No Agency</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={agent.is_active ? 'default' : 'secondary'}>
                    {agent.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ActionMenu
                    itemId={agent.id}
                    isActive={agent.is_active}
                    onStatusToggle={handleAgentStatusToggle}
                    onView={(id) => console.log('View agent:', id)}
                  />
                </TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        {/* Hotels Tab */}
        <TabsContent value="hotels" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Partner Hotels</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Hotel
            </Button>
          </div>

          <FilterableTable
            data={allHotels}
            searchPlaceholder="Search hotels by name, location, or contact..."
            searchableFields={[
              'hotel_name',
              'location_city',
              'location_country',
              'contact_email',
              'contact_phone',
            ]}
            headers={[
              'Hotel ID',
              'Hotel Name',
              'Location',
              'Star Rating',
              'Contact',
              'Status',
              'Actions',
            ]}
            exportFilename="hotels"
            exportFields={[
              { key: 'id', label: 'Hotel ID' },
              { key: 'hotel_name', label: 'Hotel Name' },
              { key: 'location_city', label: 'City' },
              { key: 'location_country', label: 'Country' },
              {
                key: 'star_rating',
                label: 'Star Rating',
                formatter: (value) => value || 'Not rated',
              },
              { key: 'contact_phone', label: 'Phone', formatter: (value) => value || 'N/A' },
              { key: 'contact_email', label: 'Email', formatter: (value) => value || 'N/A' },
              {
                key: 'is_active',
                label: 'Status',
                formatter: (value) => (value ? 'Active' : 'Inactive'),
              },
              {
                key: 'created_at',
                label: 'Created Date',
                formatter: (value) => new Date(value).toLocaleDateString(),
              },
            ]}
            onStatusToggle={handleHotelStatusToggle}
            filterOptions={[
              {
                key: 'is_active',
                label: 'Status',
                options: [
                  { value: 'true', label: 'Active' },
                  { value: 'false', label: 'Inactive' },
                ],
              },
              {
                key: 'star_rating',
                label: 'Rating',
                options: [
                  { value: '5', label: '5 Stars' },
                  { value: '4', label: '4 Stars' },
                  { value: '3', label: '3 Stars' },
                  { value: '2', label: '2 Stars' },
                  { value: '1', label: '1 Star' },
                ],
              },
            ]}
            renderRow={(hotel) => (
              <TableRow key={hotel.id}>
                <TableCell className="font-medium">
                  #{hotel.id.toString().padStart(4, '0')}
                </TableCell>
                <TableCell>
                  <p className="font-medium">{hotel.hotel_name}</p>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{hotel.location_city}</p>
                    <p className="text-sm text-muted-foreground">{hotel.location_country}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: hotel.star_rating || 0 }).map((_, i) => (
                      <Award key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    {hotel.star_rating === 0 && (
                      <span className="text-xs text-muted-foreground">Not rated</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{hotel.contact_phone || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">{hotel.contact_email || 'N/A'}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={hotel.is_active ? 'default' : 'secondary'}>
                    {hotel.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ActionMenu
                    itemId={hotel.id}
                    isActive={hotel.is_active}
                    onStatusToggle={handleHotelStatusToggle}
                    onView={(id) => console.log('View hotel:', id)}
                  />
                </TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Bookings</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Button>
          </div>

          <FilterableTable
            data={allBookings}
            searchPlaceholder="Search bookings by guest, hotel, or confirmation..."
            searchableFields={['guest_name', 'guest_email', 'confirmation_number']}
            headers={[
              'Booking ID',
              'Guest Name',
              'Hotel',
              'Agency',
              'Check-in',
              'Nights',
              'Status',
              'Amount',
              'Actions',
            ]}
            exportFilename="bookings"
            exportFields={[
              { key: 'id', label: 'Booking ID' },
              { key: 'confirmation_number', label: 'Confirmation Number' },
              { key: 'guest_name', label: 'Guest Name' },
              { key: 'guest_email', label: 'Guest Email', formatter: (value) => value || 'N/A' },
              {
                key: 'arrival_date',
                label: 'Check-in Date',
                formatter: (value) => new Date(value).toLocaleDateString(),
              },
              { key: 'number_of_nights', label: 'Nights', formatter: (value) => value || 'N/A' },
              { key: 'booking_status', label: 'Status' },
              {
                key: 'total_amount',
                label: 'Amount',
                formatter: (value) => (value ? `€${value.toLocaleString()}` : 'N/A'),
              },
              {
                key: 'created_at',
                label: 'Booking Date',
                formatter: (value) => new Date(value).toLocaleDateString(),
              },
            ]}
            filterOptions={[
              {
                key: 'booking_status',
                label: 'Status',
                options: [
                  { value: 'confirmed', label: 'Confirmed' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'cancelled', label: 'Cancelled' },
                  { value: 'completed', label: 'Completed' },
                ],
              },
            ]}
            renderRow={(booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  #{booking.id.toString().padStart(6, '0')}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{booking.guest_name}</p>
                    <p className="text-sm text-muted-foreground">{booking.guest_email || 'N/A'}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{booking.hotels?.hotel_name || 'N/A'}</p>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{booking.agencies?.company_name || 'N/A'}</p>
                </TableCell>
                <TableCell>{new Date(booking.arrival_date).toLocaleDateString()}</TableCell>
                <TableCell>{booking.number_of_nights || 'N/A'}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      booking.booking_status === 'confirmed'
                        ? 'default'
                        : booking.booking_status === 'pending'
                          ? 'secondary'
                          : booking.booking_status === 'completed'
                            ? 'outline'
                            : 'destructive'
                    }
                  >
                    {booking.booking_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-green-600">
                    €{booking.total_amount?.toLocaleString() || 'N/A'}
                  </span>
                </TableCell>
                <TableCell>
                  <ActionMenu
                    itemId={booking.id}
                    isActive={true}
                    onView={(id) => console.log('View booking:', id)}
                    onEdit={(id) => console.log('Edit booking:', id)}
                  />
                </TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">System Settings</h2>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Advanced Settings
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Platform Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Platform Name</label>
                  <p className="font-medium">Travel Incentive Program</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Version</label>
                  <p className="font-medium">v1.0.0</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Environment</label>
                  <Badge variant="outline">Production</Badge>
                </div>
                <Button variant="outline" size="sm">
                  Edit Configuration
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Total Users:</span>
                  <span className="font-medium">{totalAgencies + 10}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Sessions:</span>
                  <span className="font-medium">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Admin Users:</span>
                  <span className="font-medium">3</span>
                </div>
                <Button variant="outline" size="sm">
                  Manage Users
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
