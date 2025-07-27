import { Metadata } from 'next';
import AgentApplicationForm from '@/components/AgentApplicationForm';

export const metadata: Metadata = {
  title: 'Agent Application | Travel Incentive Program',
  description: 'Apply to become a travel agent and join our reward program',
};

export default function AgentApplicationPage() {
  return <AgentApplicationForm />;
}
