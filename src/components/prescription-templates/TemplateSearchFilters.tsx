import AppSearchBar from "@/components/common/AppSearchBar";

type Props = {
  search: string;
  onSearchChange: (text: string) => void;
};

export default function TemplateSearchFilters({
  search,
  onSearchChange,
}: Props) {
  return (
    <AppSearchBar
      value={search}
      onChangeText={onSearchChange}
      placeholder="Search templates..."
    />
  );
}