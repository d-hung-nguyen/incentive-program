import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const searchTerm = searchParams.get('q');

  if (!searchTerm) {
    return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
  }

  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('agencies')
      .select('id, name, city, country, zip_code, address, is_active') // Include address
      .or(`name.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%`)
      .eq('is_active', true)
      .order('name', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error searching agencies:', error);
      return NextResponse.json({ error: 'Failed to search agencies' }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('Error in search agencies API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
