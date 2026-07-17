import AppCard from "@/components/common/AppCard";
import SectionHeader from "@/components/common/SectionHeader";
import { SPACING } from "@/theme";
import { ComplaintSection } from "../models/ComplaintSection";
import ComplaintFieldRenderer from "./ComplaintFieldRenderer";

type Props = {
  section: ComplaintSection;
  values: Record<string, any>;
  onChange: (fieldCode: string, value: any) => void;
};

export default function ComplaintSectionRenderer({
  section,
  values,
  onChange,
}: Props) {
  return (
    <AppCard
      style={{
        marginBottom: SPACING.sm,
      }}
    >
      <SectionHeader title={section.title} />

      {section.fields.map((field) => (
        <ComplaintFieldRenderer
          key={field.code}
          field={field}
          value={values[field.code]}
          onChange={(value) =>
            onChange(field.code, value)
          }
        />
      ))}
    </AppCard>
  );
}