import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Battery, Calendar, Car, Loader2, MapPin } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetMyAppointments } from "../hooks/useQueries";

export function MyAppointmentsPage() {
  const { identity } = useInternetIdentity();
  const { data: appointments, isLoading } = useGetMyAppointments();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container py-20">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              Please login to view your appointments
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "confirmed":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "completed":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "cancelled":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  const formatVehicleType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatBatteryCapacity = (capacity: string) => {
    return capacity.charAt(0).toUpperCase() + capacity.slice(1);
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
            My Appointments
          </h1>
          <p className="text-lg text-muted-foreground">
            View and manage your charging appointments
          </p>
        </div>

        {!appointments || appointments.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Appointments</CardTitle>
              <CardDescription>
                You haven't scheduled any charging appointments yet.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => {
              const scheduledDate = new Date(
                Number(appointment.scheduledTime) / 1_000_000,
              );

              return (
                <Card key={appointment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">
                          Appointment #{appointment.id}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Scheduled for {format(scheduledDate, "PPP")} at{" "}
                          {format(scheduledDate, "p")}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Car className="mt-0.5 h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Vehicle</p>
                          <p className="text-sm text-muted-foreground">
                            {formatVehicleType(appointment.vehicleType)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Battery className="mt-0.5 h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            Battery Capacity
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatBatteryCapacity(appointment.batteryCapacity)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Booked On</p>
                          <p className="text-sm text-muted-foreground">
                            {format(
                              new Date(
                                Number(appointment.createdTime) / 1_000_000,
                              ),
                              "PPP",
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
