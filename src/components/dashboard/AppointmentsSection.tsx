import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { CalendarClock, Loader2 } from "lucide-react";

import { getAppointments } from "@/api/appointmentApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import type { Appointment } from "@/types/appointment";

const DEFAULT_DATE = new Date().toISOString().split("T")[0] as string;

function getStatusVariant(status: string | undefined) {
  switch (status) {
    case "Successfully Done":
      return "success" as const;
    case "Pending":
    case "Scheduled":
      return "warning" as const;
    default:
      return "secondary" as const;
  }
}

export function AppointmentsSection() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(DEFAULT_DATE);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getAppointments({
          startDate: selectedDate,
          offset: page - 1,
        });

        setAppointments(data.result);
        setTotalPages(Math.max(data.totalPages, 1));
      } catch (err) {
        console.error("Failed to load appointments", err);
        setError("Unable to load appointments. Please try again.");
        setAppointments([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAppointments();
  }, [selectedDate, page]);

  const pageLabel = useMemo(() => `Page ${page} of ${totalPages}`, [page, totalPages]);

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value || DEFAULT_DATE);
    setPage(1);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-xl">Appointments</CardTitle>
          <CardDescription>
            Review scheduled and completed appointments for the selected date.
          </CardDescription>
        </div>
        <CalendarClock className="size-6 text-primary" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Label htmlFor="appointment-date">Filter by date</Label>
            <Input
              id="appointment-date"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="sm:w-52"
              max={DEFAULT_DATE}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{pageLabel}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
                disabled={page === 1 || isLoading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
                disabled={page === totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Fee</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Loading appointments…
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                    {error}
                  </TableCell>
                </TableRow>
              ) : appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                    No appointments found for the selected date.
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((appointment) => {
                  const status = appointment.Status;
                  return (
                    <TableRow key={appointment.appointmentId}>
                      <TableCell className="font-medium">{appointment.userName}</TableCell>
                      <TableCell>{appointment.doctorName}</TableCell>
                      <TableCell>{formatDate(appointment.appointmentDate)}</TableCell>
                      <TableCell>
                        {appointment.startTime} - {appointment.endTime}
                      </TableCell>
                      <TableCell className="text-right">
                        {appointment.fee.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={getStatusVariant(status)}>{status}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
