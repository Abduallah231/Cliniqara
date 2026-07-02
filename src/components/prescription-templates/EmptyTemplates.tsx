import AppEmptyState from "@/components/common/AppEmptyState";

type Props = {
  folder?: boolean;
};

export default function EmptyTemplates({
  folder = false,
}: Props) {
  return (
    <AppEmptyState
      icon={
        folder
          ? "folder-open-outline"
          : "document-text-outline"
      }
      title={
        folder
          ? "No Folders Found"
          : "No Templates Found"
      }
      subtitle={
        folder
          ? "Create your first folder to organize prescription templates."
          : "Create your first prescription template to get started."
      }
    />
  );
}