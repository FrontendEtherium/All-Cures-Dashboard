import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Doctor } from "@/types/doctor"

export type DoctorDetailDialogProps = {
  doctor: Doctor | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DoctorDetailDialog({ doctor, open, onOpenChange }: DoctorDetailDialogProps) {
  const details = doctor ? buildDetails(doctor) : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        {doctor ? (
          <div className="space-y-5">
            <DialogHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <DialogTitle>{formatFullName(doctor)}</DialogTitle>
                  <DialogDescription>
                    {doctor.specialtyName || "Specialty not specified"}
                  </DialogDescription>
                </div>
                <Badge variant={doctor.docActive ? "success" : "secondary"}>
                  {doctor.docActive ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </DialogHeader>

            <div className="grid gap-4 sm:grid-cols-2">
              {details.map(({ label, value }) => (
                <div key={label} className="space-y-1 text-sm">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    {label}
                  </p>
                  <p className="font-medium leading-snug text-foreground">{value}</p>
                </div>
              ))}
            </div>

            {doctor.about ? (
              <section className="space-y-2 text-sm">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  About
                </p>
                <p className="leading-relaxed text-muted-foreground">{doctor.about}</p>
              </section>
            ) : null}

            {(doctor.degreeDescription || doctor.universityName) && (
              <div className="grid gap-4 sm:grid-cols-2">
                {doctor.degreeDescription ? (
                  <div className="space-y-1 text-sm">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Degree
                    </p>
                    <p className="font-medium leading-snug">{doctor.degreeDescription}</p>
                  </div>
                ) : null}
                {doctor.universityName ? (
                  <div className="space-y-1 text-sm">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      University
                    </p>
                    <p className="font-medium leading-snug">{doctor.universityName}</p>
                  </div>
                ) : null}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

type DetailItem = {
  label: string
  value: string
}

function buildDetails(doctor: Doctor): DetailItem[] {
  return [
    { label: "Medicine type", value: fallback(doctor.medicineTypeName) },
    { label: "Specialty", value: fallback(doctor.specialtyName) },
    {
      label: "Other specializations",
      value: fallback(doctor.otherSpecializations),
    },
    { label: "Fee", value: formatCurrency(doctor.fee) },
    { label: "Waiting time", value: fallback(doctor.waitingTime) },
    {
      label: "Video consultation",
      value:
        doctor.videoService === 1
          ? "Available"
          : doctor.videoService === 0
            ? "Not available"
            : "—",
    },
    { label: "Contact", value: fallback(doctor.telephoneNos) },
    { label: "Email", value: fallback(doctor.email) },
    { label: "Hospital", value: fallback(doctor.hospitalAffiliated) },
    { label: "Address", value: formatAddress(doctor) },
    { label: "Year of graduation", value: fallback(doctor.yearOfGraduation) },
    { label: "Joined", value: formatDateValue(doctor.createdDate) },
    { label: "Last updated", value: formatDateValue(doctor.lastUpdatedDate) },
    { label: "Verified", value: doctor.verified === 1 ? "Verified" : "Not verified" },
  ]
}

function formatFullName(doctor: Doctor) {
  return [doctor.prefix, doctor.firstName, doctor.middleName, doctor.lastName]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(" ")
    .trim()
}

function formatAddress(doctor: Doctor) {
  const parts = [
    doctor.address1,
    doctor.address2,
    doctor.cityName,
    doctor.addressState,
    doctor.addressCountry,
  ].filter((part): part is string => Boolean(part && part.trim()))

  return parts.length ? parts.join(", ") : "—"
}

function formatCurrency(value: number | null) {
  if (value === null || value === undefined) {
    return "—"
  }

  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  })
}

function formatDateValue(value: string | null) {
  if (!value) {
    return "—"
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function fallback(value: unknown) {
  if (value === null || value === undefined) {
    return "—"
  }

  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed.length ? trimmed : "—"
  }

  return String(value)
}
