'use client';

// AgentApplicationForm.tsx
// A multi-step form allowing users to apply as travel agents,
// including personal info, agency search/creation, and review.

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User, Building2, MapPin, Search, Check, AlertCircle, Loader2 } from 'lucide-react';
import { createAgentWithAgency, searchAgencies } from '@/lib/client-api';

// Data shape for an Agency record returned from the search API.
interface Agency {
  id: string;
  name: string;
  city: string;
  country: string;
  zip_code: string;
  address: string;
  is_active: boolean;
}

// Form data structure to capture agent and agency details.
interface AgentFormData {
  first_name: string;
  last_name: string;
  email: string;
  telephone: string;
  agency_name: string;
  agency_city: string;
  agency_country: string;
  agency_zip_code: string;
  agency_address: string;
}

// Default values for the form fields.
const initialFormData: AgentFormData = {
  first_name: '',
  last_name: '',
  email: '',
  telephone: '',
  agency_name: '',
  agency_city: '',
  agency_country: '',
  agency_zip_code: '',
  agency_address: '',
};

// React component for the agent application form.
export default function AgentApplicationForm() {
  // Local state hooks for managing form data and UI state.
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AgentFormData>(initialFormData);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [searchResults, setSearchResults] = useState<Agency[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);

  // Handler to update formData state when inputs change.
  const handleInputChange = (field: keyof AgentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Searches for agencies matching the search term via API.
  const handleAgencySearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchAgencies(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching agencies:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Populates form fields with data from a selected existing agency.
  const handleSelectExistingAgency = (agency: Agency) => {
    setSelectedAgency(agency);
    setFormData((prev) => ({
      ...prev,
      agency_name: agency.name,
      agency_city: agency.city,
      agency_country: agency.country,
      agency_zip_code: agency.zip_code,
      agency_address: agency.address || '',
    }));
  };

  // Clears selected agency to allow creating a new one.
  const handleCreateNewAgency = () => {
    setSelectedAgency(null);
    setFormData((prev) => ({
      ...prev,
      agency_name: '',
      agency_city: '',
      agency_country: '',
      agency_zip_code: '',
      agency_address: '',
    }));
  };

  // Submits the application, creating agent with associated agency.
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        ...(selectedAgency && { existing_agency_id: selectedAgency.id }),
      };

      const result = await createAgentWithAgency(submitData);
      setSubmitResult(result);
      setShowSuccessDialog(true);

      if (!result.success && result.suggest_search) {
        setCurrentStep(2);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitResult({ success: false, error: 'Failed to submit application' });
      setShowSuccessDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validates required fields for each step before navigation or submission.
  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.first_name && formData.last_name && formData.email && formData.telephone;
      case 2:
        return (
          selectedAgency ||
          (formData.agency_name &&
            formData.agency_city &&
            formData.agency_country &&
            formData.agency_zip_code)
        );
      default:
        return true;
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Agent Application Form</h1>
        <p className="text-muted-foreground">
          Join our travel agent network and start earning rewards
        </p>
      </div>

      {/* Progress Indicator showing current step */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  step <= currentStep
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-300 bg-white text-gray-300'
                }`}
              >
                {step < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{step}</span>
                )}
              </div>
              {step < 3 && (
                <div className={`h-1 w-16 ${step < currentStep ? 'bg-blue-600' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center space-x-16 text-sm">
          <span className={currentStep >= 1 ? 'font-medium text-blue-600' : 'text-gray-500'}>
            Personal Info
          </span>
          <span className={currentStep >= 2 ? 'font-medium text-blue-600' : 'text-gray-500'}>
            Agency Details
          </span>
          <span className={currentStep >= 3 ? 'font-medium text-blue-600' : 'text-gray-500'}>
            Review & Submit
          </span>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Step 1: Personal Information */}
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <CardHeader className="px-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    placeholder="Enter your first name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    placeholder="Enter your last name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="telephone">Phone Number *</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Agency Information */}
          {/* Step 2: Agency Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <CardHeader className="px-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Agency Information
                </CardTitle>
              </CardHeader>

              <Tabs defaultValue="search" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="search">Search Existing Agency</TabsTrigger>
                  <TabsTrigger value="create">Create New Agency</TabsTrigger>
                </TabsList>

                <TabsContent value="search" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search by agency name, city, or country..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAgencySearch()}
                      />
                      <Button onClick={handleAgencySearch} disabled={isSearching}>
                        {isSearching ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                        Search
                      </Button>
                    </div>

                    {searchResults.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Search Results:</h4>
                        <div className="grid max-h-64 gap-3 overflow-y-auto">
                          {searchResults.map((agency) => (
                            <Card
                              key={agency.id}
                              className={`cursor-pointer transition-colors ${
                                selectedAgency?.id === agency.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'hover:bg-gray-50'
                              }`}
                              onClick={() => handleSelectExistingAgency(agency)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h5 className="font-medium">{agency.name}</h5>
                                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                      {agency.address}, {agency.zip_code},{agency.city},
                                      {agency.country}
                                    </div>
                                  </div>
                                  <Badge variant={agency.is_active ? 'default' : 'secondary'}>
                                    {agency.is_active ? 'Active' : 'Inactive'}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedAgency && (
                      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                        <div className="mb-2 flex items-center gap-2 text-green-800">
                          <Check className="h-4 w-4" />
                          <span className="font-medium">Selected Agency</span>
                        </div>
                        <div className="text-green-700">
                          <p className="font-medium">{selectedAgency.name}</p>
                          <p className="text-sm">
                            {selectedAgency.address}, {selectedAgency.zip_code},
                            {selectedAgency.city}, {selectedAgency.country}{' '}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={handleCreateNewAgency}
                        >
                          Choose Different Agency
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="create" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="agency_name">Agency Name *</Label>
                      <Input
                        id="agency_name"
                        value={formData.agency_name}
                        onChange={(e) => handleInputChange('agency_name', e.target.value)}
                        placeholder="Enter agency name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="agency_country">Country *</Label>
                      <Select
                        value={formData.agency_country}
                        onValueChange={(value) => handleInputChange('agency_country', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Germany">Germany</SelectItem>
                          <SelectItem value="Austria">Austria</SelectItem>
                          <SelectItem value="Switzerland">Switzerland</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Sweden">Sweden</SelectItem>
                          <SelectItem value="Denmark">Denmark</SelectItem>
                          <SelectItem value="Finland">Finland</SelectItem>
                          <SelectItem value="Norway">Norway</SelectItem>
                          <SelectItem value="Poland">Poland</SelectItem>
                          <SelectItem value="Czech Republic">Czech Republic</SelectItem>
                          <SelectItem value="Romania">Romania</SelectItem>
                          <SelectItem value="Hungary">Hungary</SelectItem>
                          <SelectItem value="Slovakia">Slovakia</SelectItem>
                          <SelectItem value="Croatia">Croatia</SelectItem>
                          <SelectItem value="Slovenia">Slovenia</SelectItem>
                          <SelectItem value="Bulgaria">Bulgaria</SelectItem>
                          <SelectItem value="Slovakia">Slovakia</SelectItem>
                          <SelectItem value="Estonia">Estonia</SelectItem>
                          <SelectItem value="Latvia">Latvia</SelectItem>
                          <SelectItem value="Lithuania">Lithuania</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="agency_city">City *</Label>
                      <Input
                        id="agency_city"
                        value={formData.agency_city}
                        onChange={(e) => handleInputChange('agency_city', e.target.value)}
                        placeholder="Enter city"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="agency_zip_code">ZIP Code *</Label>
                      <Input
                        id="agency_zip_code"
                        value={formData.agency_zip_code}
                        onChange={(e) => handleInputChange('agency_zip_code', e.target.value)}
                        placeholder="Enter ZIP code"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="agency_address">Address *</Label>
                      <Input
                        id="agency_address"
                        value={formData.agency_address}
                        onChange={(e) => handleInputChange('agency_address', e.target.value)}
                        placeholder="Enter full address"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <CardHeader className="px-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-blue-600" />
                  Review Your Application
                </CardTitle>
              </CardHeader>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <strong>Name:</strong> {formData.first_name} {formData.last_name}
                    </div>
                    <div>
                      <strong>Email:</strong> {formData.email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {formData.telephone}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Agency Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <strong>Agency:</strong> {formData.agency_name}
                    </div>
                    {formData.agency_address && (
                      <div>
                        <strong>Address:</strong> {formData.agency_address}
                      </div>
                    )}
                    <div>
                      <strong>Location:</strong> {formData.agency_zip_code}, {formData.agency_city}, {formData.agency_country}
                    </div>
                    {selectedAgency && (
                      <div className="mt-2">
                        <Badge variant="outline">
                          Existing Agency
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          Agency details will always reflect the current information from our database
                        </p>
                      </div>
                    )}
                    {!selectedAgency && (
                      <div className="mt-2">
                        <Badge variant="default">
                          New Agency
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900">Important Notice</h4>
                    <p className="mt-1 text-sm text-blue-800">
                      By submitting this application, you agree to our terms and conditions. Your
                      application will be reviewed and you will receive a confirmation email within
                      24-48 hours.
                    </p>
                    <p className="mt-2 text-sm text-blue-800">
                      <strong>Note:</strong> If you select an existing agency, your agent profile will always 
                      display the most current agency information from our database.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons for form steps */}
          <div className="flex justify-between border-t pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={!isStepValid(currentStep)}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting || !isStepValid(currentStep)}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal dialog showing submission outcome */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {submitResult?.success ? (
                <>
                  <Check className="h-5 w-5 text-green-600" />
                  Application Submitted Successfully!
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  {submitResult?.error_type === 'duplicate_email'
                    ? 'Agent Already Exists'
                    : 'Application Failed'}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {submitResult?.success ? (
                <div className="space-y-2">
                  <p>Your agent application has been submitted successfully.</p>
                  <p>
                    You will receive a confirmation email with further instructions within 24-48
                    hours.
                  </p>
                </div>
              ) : submitResult?.error_type === 'duplicate_email' ? (
                <div className="space-y-3">
                  <p>An agent with this email address is already registered in our system.</p>

                  {submitResult?.existing_agent && (
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                      <h4 className="mb-2 font-medium text-orange-900">Existing Agent Details:</h4>
                      <div className="space-y-1 text-sm text-orange-800">
                        <p>
                          <strong>Name:</strong> {submitResult.existing_agent.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {submitResult.existing_agent.email}
                        </p>
                        <p>
                          <strong>Agency:</strong> {submitResult.existing_agent.agency}
                        </p>
                        <p>
                          <strong>Location:</strong> {submitResult.existing_agent.location}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <p className="font-medium">What you can do:</p>
                    <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                      <li>
                        Use a different email address if you want to create a new agent profile
                      </li>
                      <li>Contact support if you believe this is an error</li>
                      <li>
                        If this is your existing account, you can log in to access your agent
                        dashboard
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p>There was an error submitting your application:</p>
                  <p className="text-red-600">{submitResult?.error}</p>
                  {submitResult?.suggest_search ? (
                    <p className="text-sm text-muted-foreground">
                      Try searching for the existing agency instead of creating a new one.
                    </p>
                  ) : (
                    <p>Please try again or contact support if the problem persists.</p>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowSuccessDialog(false)}>
              Close
            </Button>
            {submitResult?.success && (
              <Button onClick={() => (window.location.href = '/agent')}>View Agents</Button>
            )}
            {submitResult?.error_type === 'duplicate_email' && (
              <Button
                onClick={() => (window.location.href = '/agent/login')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Go to Login
              </Button>
            )}
            {submitResult?.suggest_search && (
              <Button
                onClick={() => {
                  setShowSuccessDialog(false);
                  setCurrentStep(2);
                }}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Search Agencies
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
