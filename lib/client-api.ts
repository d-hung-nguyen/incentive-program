export async function searchAgencies(searchTerm: string) {
  try {
    const response = await fetch(`/api/agents/search-agencies?q=${encodeURIComponent(searchTerm)}`);

    if (!response.ok) {
      throw new Error('Failed to search agencies');
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error searching agencies:', error);
    return [];
  }
}

export async function createAgentWithAgency(agentData: {
  first_name: string;
  last_name: string;
  email: string;
  telephone: string;
  agency_name: string;
  agency_city: string;
  agency_country: string;
  agency_zip_code: string;
  agency_address: string;
  existing_agency_id?: string;
}) {
  try {
    const response = await fetch('/api/agents/create-with-agency', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agentData),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to create agent application',
        error_type: result.error_type,
        existing_agent: result.existing_agent,
        existing_application: result.existing_application,
        suggest_search: result.suggest_search,
        existing_agency: result.existing_agency,
        details: result.details,
        ...result,
      };
    }

    return { success: true, ...result };
  } catch (error) {
    console.error('Error in createAgentWithAgency:', error);
    return {
      success: false,
      error: 'Network error occurred',
      error_type: 'network_error',
    };
  }
}

export async function assignAgentToExistingAgency(agentId: string, agencyId: string) {
  try {
    const response = await fetch('/api/agents/assign-to-agency', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_id: agentId, agency_id: agencyId }),
    });
    const result = await response.json();
    if (!response.ok) {
      return { success: false, error: result.error || 'Failed to assign agent' };
    }
    return result;
  } catch (error) {
    console.error('Error in assignAgentToExistingAgency:', error);
    return { success: false, error: 'Network error occurred' };
  }
}

// Add function to handle agents without agencies
export async function getUnassignedAgents() {
  try {
    const response = await fetch('/api/agents/unassigned');

    if (!response.ok) {
      throw new Error('Failed to fetch unassigned agents');
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching unassigned agents:', error);
    return [];
  }
}

// Add function to reassign agent to new agency
export async function reassignAgent(agentId: string, newAgencyId: string | null) {
  try {
    const response = await fetch('/api/agents/reassign', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_id: agentId,
        agency_id: newAgencyId, // null to unassign
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      return { success: false, error: result.error || 'Failed to reassign agent' };
    }
    return result;
  } catch (error) {
    console.error('Error reassigning agent:', error);
    return { success: false, error: 'Network error occurred' };
  }
}

// Add this function to your existing client-api.ts
export async function getAllAgents() {
  try {
    const response = await fetch('/api/agents');

    if (!response.ok) {
      throw new Error('Failed to fetch agents');
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching agents:', error);
    return [];
  }
}

export async function getAgentById(agentId: string) {
  try {
    const response = await fetch(`/api/agents/${agentId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch agent');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching agent:', error);
    return null;
  }
}
