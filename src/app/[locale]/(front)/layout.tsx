import "../../../../public/assets/css/main.css";
import { VisitTracker } from "@/components/common/VisitTracker";

export default function FrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <VisitTracker />
      {children}
    </>
  );
}
