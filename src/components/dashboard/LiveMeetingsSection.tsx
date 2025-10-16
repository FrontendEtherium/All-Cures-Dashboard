import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, Video } from "lucide-react";

import { getLiveMeetingEvents, type LiveMeetingEvent } from "@/api/liveMeetingApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatDateTime(value: string | null) {
  if (!value) return "—";
  return value;
}

function formatDuration(value: number | null) {
  if (value === null || value === undefined) return "—";
  const totalSeconds = Math.max(Math.floor(value), 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  }
  return `${seconds}s`;
}

function getEventVariant(type: string | null) {
  if (!type) return "secondary" as const;
  if (type.includes("joined")) return "success" as const;
  if (type.includes("left")) return "warning" as const;
  if (type.includes("meeting")) return "secondary" as const;
  return "default" as const;
}

function splitIsoDateTime(value: string | null) {
  if (!value) {
    return { date: "—", time: "—" };
  }
  const [datePart, timePart] = value.split("T");
  if (!timePart) {
    return { date: value, time: "—" };
  }
  return {
    date: datePart,
    time: timePart,
  };
}

export function LiveMeetingsSection() {
  const [events, setEvents] = useState<LiveMeetingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getLiveMeetingEvents();
      setEvents([...data].reverse());
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error("Failed to load live meeting events", err);
      setError("Unable to load live meeting updates. Please try again.");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const lastUpdatedLabel = useMemo(() => {
    if (!lastUpdated) return null;
    return `Last updated ${formatDateTime(lastUpdated)}`;
  }, [lastUpdated]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl">Live Meeting Updates</CardTitle>
          <CardDescription>
            Monitor real-time meeting events captured from the telehealth platform.
          </CardDescription>
          {lastUpdatedLabel ? (
            <p className="text-xs text-muted-foreground">{lastUpdatedLabel}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void loadEvents()}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <RefreshCw className="mr-2 size-4" />}
            Refresh
          </Button>
          <div className="hidden rounded-full bg-primary/10 p-2 text-primary sm:block">
            <Video className="size-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[4rem]">ID</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Participant</TableHead>
                <TableHead>Meeting</TableHead>
                <TableHead className="text-right">Duration</TableHead>
                <TableHead>Event Date</TableHead>
                {/* <TableHead>Event Time</TableHead> */}
                <TableHead>Additional Info</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Loading live meeting updates…
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-sm text-muted-foreground">
                    {error}
                  </TableCell>
                </TableRow>
              ) : events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-sm text-muted-foreground">
                    No live meeting activity found.
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => {
                  const { date, time } = splitIsoDateTime(event.eventTime);

                  return (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.id}</TableCell>
                      <TableCell>
                        <Badge variant={getEventVariant(event.eventType)}>
                          {event.eventType ?? "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>{event.role ?? "—"}</TableCell>
                      <TableCell>
                        <span className="block max-w-[12rem] truncate" title={event.participantId ?? "—"}>
                          {event.participantId ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="block max-w-[12rem] truncate" title={event.meetingId ?? "—"}>
                          {event.meetingId ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{formatDuration(event.durationSeconds)}</TableCell>
                      <TableCell>{date}</TableCell>
                      {/* <TableCell>{time}</TableCell> */}
                      <TableCell>
                        <span className="block max-w-[12rem] truncate" title={event.eventCode ?? "—"}>
                          {event.eventCode ?? "—"}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        {!isLoading && events.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            Raw payload available for debugging in developer tools. Each row holds the full response for the event.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default LiveMeetingsSection;
