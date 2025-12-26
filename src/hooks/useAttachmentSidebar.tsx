import { createContext, useContext, useState } from "react";

interface AttachmentSidebarContextValue {
  attachedFileName: string | null;
  setAttachedFileName: (name: string | null) => void;
}

const AttachmentSidebarContext = createContext<AttachmentSidebarContextValue | undefined>(
  undefined,
);

export const AttachmentSidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);

  return (
    <AttachmentSidebarContext.Provider
      value={{ attachedFileName, setAttachedFileName }}
    >
      {children}
    </AttachmentSidebarContext.Provider>
  );
};

export const useAttachmentSidebar = () => {
  const context = useContext(AttachmentSidebarContext);
  if (!context) {
    throw new Error(
      "useAttachmentSidebar deve ser usado dentro de AttachmentSidebarProvider",
    );
  }
  return context;
};
