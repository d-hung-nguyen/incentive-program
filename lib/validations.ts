import { z } from 'zod';

export const agentFormSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Valid email is required'),
  telephone: z.string().min(10, 'Valid phone number is required'),
  agency_name: z.string().min(1, 'Agency name is required').max(100),
  agency_city: z.string().min(1, 'City is required').max(50),
  agency_country: z.string().min(1, 'Country is required').max(50),
  agency_zip_code: z.string().min(1, 'ZIP code is required').max(20),
  agency_email: z.string().email('Valid agency email is required').optional(),
  agency_telephone: z.string().min(10, 'Valid agency phone is required').optional(),
  agency_address: z.string().max(200).optional(),
});

export type AgentFormData = z.infer<typeof agentFormSchema>;

export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  userType: z.enum(['agent', 'regional', 'admin'], {
    required_error: 'Please select a user type',
  }),
});

export type SignupFormData = z.infer<typeof signupSchema>;
