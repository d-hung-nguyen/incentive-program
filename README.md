# Travel Incentive Program

A comprehensive travel agency incentive management system built with Next.js, Supabase, and modern web technologies.

## Overview

This platform manages travel agency partnerships and incentive programs, allowing hotels and travel organizations to reward agencies based on booking performance through a sophisticated point system.

## Features

### 🏨 Hotel Management

- Complete hotel directory with location mapping
- Hotel categorization and amenities tracking
- Performance analytics and booking insights

### 🏢 Agency Partnership

- Travel agency registration and verification
- IATA certification tracking
- Agency performance monitoring and tier management

### 📊 Smart Point System

- Room-type based point allocation:
  - Standard rooms/villas: 1 point per night
  - Premium suites: 1.5 points per night
  - Family accommodations: 2 points per night
  - Signature suites: 4 points per night
- Automated point calculation and tracking
- Real-time balance updates

### 🎁 Reward System

- **Amazon Vouchers**: €0.01 per point (min 500 points)
- **Booking Credits**: €0.012 per point (min 250 points)
- **Direct Cash**: €0.008 per point (min 1000 points)
- Flexible redemption options with tier-based bonuses

### 📈 Analytics Dashboard

- Real-time booking statistics
- Revenue tracking and forecasting
- Agency performance metrics
- Point distribution analytics

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI Components**: Tailwind CSS, Radix UI, Lucide Icons
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL with Row Level Security

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/incentive-program.git
cd incentive-program
```

1. Install dependencies:

```bash
npm install
```

1. Set up environment variables:

```bash
cp .env.example .env.local
```

1. Add your Supabase credentials to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the development server:

```bash
npm run dev
```

1. Open <http://localhost:3000> in your browser.

## Database Schema

### Core Tables

#### Organizations

- Organization management and hierarchy
- Multi-tenant support with role-based access

#### Hotels

```sql
hotels (
  id, hotel_name, location_city, location_country,
  star_rating, amenities, contact_info, is_active
)
```

#### Agencies

```sql
agencies (
  id, company_name, contact_person, email, phone,
  iata_code, specializations, tier_level, is_active
)
```

#### Room Types & Points

```sql
room_type_points (
  id, room_type_key, room_type_name, points_per_night,
  category, description, is_active
)
```

#### Bookings

```sql
bookings (
  id, hotel_id, agency_id, room_type_id, guest_info,
  dates, room_details, pricing, status, confirmation_number
)
```

#### Point System

```sql
agency_points (
  id, agency_id, booking_id, points_earned,
  points_type, calculation_details, earned_at
)

point_redemptions (
  id, agency_id, points_used, voucher_type,
  voucher_value, status, voucher_code
)
```

## API Endpoints

### Booking API Endpoints

- `GET /api/bookings` - List all bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Cancel booking

### Points

- `GET /api/points/[agencyId]` - Get agency point balance
- `POST /api/points/redeem` - Redeem points for vouchers
- `GET /api/room-types` - Get room types and point values

### Analytics

- `GET /api/stats` - System-wide statistics
- `GET /api/reports/agency/[id]` - Agency performance report

## Point Calculation Logic

```typescript
const calculatePoints = (roomType: string, nights: number, rooms: number) => {
  const pointsPerNight = ROOM_TYPE_POINTS[roomType] || 1;
  return pointsPerNight * nights * rooms;
};
```

### Room Type Categories

| Category  | Points/Night | Examples                          |
| --------- | ------------ | --------------------------------- |
| Standard  | 1.0          | Standard Room, Deluxe Room, Villa |
| Premium   | 1.5          | Junior Suite, Executive Suite     |
| Family    | 2.0          | Two Bedroom Suite, Family Suite   |
| Signature | 4.0          | Presidential Suite, Royal Suite   |

## Deployment

### Supabase Setup

1. Create new Supabase project
2. Run database migrations from `/sql` directory
3. Set up Row Level Security policies
4. Configure authentication providers

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with automatic previews for pull requests

```bash
npm run build
npm run start
```

## Development

### Project Structure

```text
├── app/                    # Next.js 13+ app directory
│   ├── dashboard/         # Admin dashboard
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components
│   └── RoomPointCalculator.tsx
├── lib/                 # Utilities and configurations
│   ├── database.ts      # Database functions
│   ├── utils.ts         # Helper functions
│   └── pointsSystem.ts  # Point calculation logic
├── utils/               # Supabase client configuration
└── sql/                 # Database migrations
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript check

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- Row Level Security (RLS) enabled on all tables
- JWT-based authentication through Supabase
- API rate limiting and input validation
- Secure environment variable handling

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Create an issue on GitHub
- Email: [support@your-domain.com](mailto:support@your-domain.com)
- Documentation: [Wiki](https://github.com/your-username/incentive-program/wiki)

## Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Integration with external booking systems
- [ ] Automated email notifications
- [ ] Advanced reporting features

---

Built with ❤️ using Next.js and Supabase
