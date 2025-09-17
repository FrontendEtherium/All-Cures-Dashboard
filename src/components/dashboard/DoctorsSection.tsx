import { useEffect, useState } from "react"
import { Stethoscope } from "lucide-react"

import { getAvailableDoctors } from "@/api/doctorApi"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Doctor } from "@/types/doctor"

import { DoctorDetailDialog } from "./DoctorDetailDialog"

const MED_TYPE_MAP = {
  ayurveda: 1,
  homeopathy: 8,
  persian: 3,
  naturopathy: 9,
  unani: 2,
  chinese: 4,
} as const

export function DoctorsSection() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [medTypeID, setMedTypeID] = useState<number | undefined>(undefined)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchDoctors = async () => {
      const offset = (currentPage - 1) * 10
      const data = await getAvailableDoctors(offset, medTypeID)
      setDoctors(data.data)
      setTotalPages(data.totalPagesCount.totalPages)
    }

    void fetchDoctors()
  }, [currentPage, medTypeID])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleMedTypeChange = (medType: number | undefined) => {
    setMedTypeID(medType)
    setCurrentPage(1)
  }

  const handleOpenDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setIsDialogOpen(true)
  }

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setSelectedDoctor(null)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Doctors</CardTitle>
          <CardDescription>Track availability across the network.</CardDescription>
        </div>
        <Stethoscope className="size-6 text-primary" />
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="mb-4 flex flex-wrap gap-2">
          <Button
            variant={medTypeID === undefined ? "default" : "outline"}
            onClick={() => handleMedTypeChange(undefined)}
          >
            All
          </Button>
          {Object.entries(MED_TYPE_MAP).map(([name, id]) => (
            <Button
              key={id}
              variant={medTypeID === id ? "default" : "outline"}
              onClick={() => handleMedTypeChange(id)}
              className="capitalize"
            >
              {name}
            </Button>
          ))}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="text-right">Active patients</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.docID}>
                <TableCell className="font-medium">
                  {[doctor.prefix, doctor.firstName, doctor.middleName, doctor.lastName]
                    .filter((part) => Boolean(part && part.trim()))
                    .join(" ")}
                </TableCell>
                <TableCell>{doctor.specialtyName}</TableCell>
                <TableCell>{`${doctor.cityName ?? ""}${doctor.addressState ? `, ${doctor.addressState}` : "-"}`}</TableCell>
                <TableCell>{doctor.docActive ? "Available" : "Unavailable"}</TableCell>
                <TableCell className="text-right">N/A</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDoctor(doctor)}>
                    View details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </CardContent>
      <DoctorDetailDialog
        doctor={selectedDoctor}
        open={isDialogOpen}
        onOpenChange={handleDialogChange}
      />
    </Card>
  )
}

export default DoctorsSection
