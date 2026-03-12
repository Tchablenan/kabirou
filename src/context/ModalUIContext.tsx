"use client";

// context/ModalUIContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

type ModalType = "mobileMenu1" | "mobileMenu2" | "demoModal" | "sidebar";

type ModalUIContextType = {
  openModals: Record<ModalType, boolean>;
  openModal: (modal: ModalType) => void;
  closeModal: (modal: ModalType) => void;
  toggleModal: (modal: ModalType) => void;
};

const ModalUIContext = createContext<ModalUIContextType | undefined>(undefined);

export const ModalUIProvider = ({ children }: { children: ReactNode }) => {
  const [openModals, setOpenModals] = useState<Record<ModalType, boolean>>({
    mobileMenu1: false,
    mobileMenu2: false,
    demoModal: false,
    sidebar: false,
  });
  const pathname = usePathname();

  // 🔁 Reset all modals when the route changes
  useEffect(() => {
    setOpenModals({
      mobileMenu1: false,
      mobileMenu2: false,
      demoModal: false,
      sidebar: false,
    });
  }, [pathname]);
  const openModal = (modal: ModalType) =>
    setOpenModals((prev) => ({ ...prev, [modal]: true }));

  const closeModal = (modal: ModalType) =>
    setOpenModals((prev) => ({ ...prev, [modal]: false }));

  const toggleModal = (modal: ModalType) =>
    setOpenModals((prev) => ({ ...prev, [modal]: !prev[modal] }));

  return (
    <ModalUIContext.Provider
      value={{ openModals, openModal, closeModal, toggleModal }}
    >
      {children}
    </ModalUIContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useModalUI = (): ModalUIContextType => {
  const context = useContext(ModalUIContext);
  if (!context)
    throw new Error("useModalUI must be used within ModalUIProvider");
  return context;
};
