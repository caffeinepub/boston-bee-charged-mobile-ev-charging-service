import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetCallerUserProfile,
  useCreateAppointment,
  useGetServicedZipCodes,
  useGetPrice,
} from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { VehicleType, BatteryCapacity } from '../backend';

export function SchedulePage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: servicedZipCodes } = useGetServicedZipCodes();
  const createAppointment = useCreateAppointment();

  const [location, setLocation] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType | ''>('');
  const [batteryCapacity, setBatteryCapacity] = useState<BatteryCapacity | ''>('');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');

  const { data: price } = useGetPrice(
    vehicleType as VehicleType,
    batteryCapacity as BatteryCapacity,
    !!(vehicleType && batteryCapacity)
  );

  const isAuthenticated = !!identity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to schedule an appointment');
      return;
    }

    if (!userProfile) {
      toast.error('Please complete your profile first');
      return;
    }

    if (!location || !vehicleType || !batteryCapacity || !date || !time) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const [hours, minutes] = time.split(':');
      const scheduledDate = new Date(date);
      scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      const scheduledTime = BigInt(scheduledDate.getTime() * 1_000_000);

      await createAppointment.mutateAsync({
        customer: {
          name: userProfile.name,
          phone: userProfile.phone,
          email: userProfile.email,
        },
        location,
        vehicleType: vehicleType as VehicleType,
        batteryCapacity: batteryCapacity as BatteryCapacity,
        scheduledTime,
      });

      toast.success('Appointment scheduled successfully!');
      navigate({ to: '/appointments' });
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to schedule appointment. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-20">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please login to schedule an appointment</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You need to be logged in to book a mobile EV charging appointment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Schedule Your Charging
          </h1>
          <p className="text-lg text-muted-foreground">
            Book a mobile EV charging appointment at your convenience
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
            <CardDescription>Fill in the information below to schedule your charging session</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location Address</Label>
                <Input
                  id="location"
                  placeholder="123 Main St, Boston, MA 02101"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
                {servicedZipCodes && (
                  <p className="text-xs text-muted-foreground">
                    We service zip codes: {servicedZipCodes.join(', ')}
                  </p>
                )}
              </div>

              {/* Vehicle Type */}
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select value={vehicleType} onValueChange={(value) => setVehicleType(value as VehicleType)}>
                  <SelectTrigger id="vehicleType">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Battery Capacity */}
              <div className="space-y-2">
                <Label htmlFor="batteryCapacity">Battery Capacity</Label>
                <Select value={batteryCapacity} onValueChange={(value) => setBatteryCapacity(value as BatteryCapacity)}>
                  <SelectTrigger id="batteryCapacity">
                    <SelectValue placeholder="Select battery capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (&lt; 40 kWh)</SelectItem>
                    <SelectItem value="medium">Medium (40-60 kWh)</SelectItem>
                    <SelectItem value="large">Large (&gt; 60 kWh)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>Preferred Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time */}
              <div className="space-y-2">
                <Label htmlFor="time">Preferred Time</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Display */}
              {price !== undefined && (
                <div className="rounded-lg bg-primary/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Estimated Price:</span>
                    <span className="text-2xl font-bold text-primary">
                      ${(Number(price) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={createAppointment.isPending}>
                {createAppointment.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  'Schedule Appointment'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
