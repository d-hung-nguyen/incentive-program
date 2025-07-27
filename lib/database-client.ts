import { createBrowserClient } from '@supabase/ssr';

const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export async function searchAgencies(searchTerm: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .or(
        `name.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
      )
      .eq('is_active', true)
      .order('name', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error searching agencies:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchAgencies:', error);
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
  agency_email: string;
  agency_telephone: string;
  agency_address?: string;
}) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.rpc('create_agent_with_agency', {
      p_first_name: agentData.first_name,
      p_last_name: agentData.last_name,
      p_email: agentData.email,
      p_telephone: agentData.telephone,
      p_agency_name: agentData.agency_name,
      p_agency_city: agentData.agency_city,
      p_agency_country: agentData.agency_country,
      p_agency_zip_code: agentData.agency_zip_code,
      p_agency_email: agentData.agency_email,
      p_agency_telephone: agentData.agency_telephone,
      p_agency_address: agentData.agency_address || '',
    });

    if (error) {
      console.error('Error calling create_agent_with_agency RPC:', error);
      return { success: false, error: error.message };
    }

    return data;
  } catch (error) {
    console.error('Error in createAgentWithAgency:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

export async function assignAgentToExistingAgency(agentId: string, agencyId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.rpc('assign_agent_to_agency', {
      p_agent_id: agentId,
      p_agency_id: agencyId,
    });

    if (error) {
      console.error('Error calling assign_agent_to_agency RPC:', error);
      return { success: false, error: error.message };
    }

    return data;
  } catch (error) {
    console.error('Error in assignAgentToExistingAgency:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}
