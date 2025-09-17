import { DoctorsSection } from "@/components/dashboard/DoctorsSection";
import { doctorDirectory } from "@/data/dashboard";

export function DoctorsPage() {
  return <DoctorsSection doctors={doctorDirectory} />;
}

export default DoctorsPage;
