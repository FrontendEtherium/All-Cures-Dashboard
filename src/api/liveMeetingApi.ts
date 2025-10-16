import api from "./axiosInstance";

const LIVE_MEETING_EVENTS_ENDPOINT = "/article/all/table/events";
const LIVE_MEETING_BEARER_TOKEN = "local@7KpRq3XvF9";

// Raw payload returned by the live meeting events endpoint.
export type LiveMeetingEventRaw = [
  number,
  boolean | null,
  boolean | null,
  boolean | null,
  string | null,
  number | null,
  string | null,
  boolean | null,
  string | null,
  string | null,
  boolean | null,
  string | null,
  string | null,
  string | null,
  string | null,
  string | null
];

export type LiveMeetingEvent = {
  id: number;
  role: string | null;
  durationSeconds: number | null;
  eventTime: string | null;
  meetingId: string | null;
  participantId: string | null;
  eventType: string | null;
  eventCode: string | null;
  eventEndTime: string | null;
  raw: LiveMeetingEventRaw;
};

const transformLiveMeetingEvent = (
  raw: LiveMeetingEventRaw
): LiveMeetingEvent => {
  const [
    id,
    ,
    ,
    ,
    role,
    durationSeconds,
    eventTime,
    ,
    ,
    ,
    ,
    meetingId,
    participantId,
    eventType,
    eventCode,
    eventEndTime,
  ] = raw;

  return {
    id,
    role,
    durationSeconds,
    eventTime,
    meetingId,
    participantId,
    eventType,
    eventCode,
    eventEndTime,
    raw,
  };
};

export const getLiveMeetingEvents = async (): Promise<LiveMeetingEvent[]> => {
  const { data } = await api.get<LiveMeetingEventRaw[]>(
    LIVE_MEETING_EVENTS_ENDPOINT,
    {
      headers: {
        Authorization: `Bearer ${LIVE_MEETING_BEARER_TOKEN}`,
      },
    }
  );

  return data.map(transformLiveMeetingEvent);
};
