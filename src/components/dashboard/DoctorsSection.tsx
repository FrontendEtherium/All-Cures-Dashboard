import { Stethoscope } from "lucide-react";

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

import { useEffect, useState } from "react";
import { getAvailableDoctors } from "@/api/doctorApi";
import type { Doctor } from "@/types/doctor";
import { Button } from "@/components/ui/button";

const MED_TYPE_MAP = {
  ayurveda: 1,
  homeopathy: 8,
  persian: 3,
  naturopathy: 9,
  unani: 2,
  chinese: 4,
};

export function DoctorsSection() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [medTypeID, setMedTypeID] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    const getDoctors = async () => {
      const offset = (currentPage - 1) * 10;
      const data = await getAvailableDoctors(offset, medTypeID);
      setDoctors(data.data);
      setTotalPages(data.totalPagesCount.totalPages);
    };
    getDoctors();
  }, [currentPage, medTypeID]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleMedTypeChange = (medType: number | undefined) => {
    setMedTypeID(medType);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Doctors</CardTitle>
          <CardDescription>
            Track availability across the network.
          </CardDescription>
        </div>
        <Stethoscope className="size-6 text-primary" />
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="flex flex-wrap gap-2 mb-4">
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.docID}>
                <TableCell className="font-medium">{`${doctor.prefix} ${
                  doctor.firstName
                } ${doctor.middleName || ""} ${doctor.lastName || ""}`}</TableCell>
                <TableCell>{doctor.specialtyName}</TableCell>
                <TableCell>{`${doctor.cityName}, ${doctor.addressState}`}</TableCell>
                <TableCell>
                  {doctor.docActive ? "Available" : "Unavailable"}
                </TableCell>
                <TableCell className="text-right">{"N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
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
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
