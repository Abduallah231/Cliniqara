import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

export default function GynecologyExam() {
  const [externalFindings, setExternalFindings] =
    useState<string[]>(["Normal"]);

  const [vaginalFindings, setVaginalFindings] =
    useState<string[]>(["Normal"]);

  const [cervixFindings, setCervixFindings] =
    useState<string[]>(["Healthy"]);

  const [uterusFindings, setUterusFindings] =
    useState<string[]>(["Normal"]);

  const [adnexalFindings, setAdnexalFindings] =
    useState<string[]>(["Normal"]);

  const [fornixFindings, setFornixFindings] =
    useState<string[]>(["Normal"]);

  const [prolapseFindings, setProlapseFindings] =
    useState<string[]>(["Absent"]);

  const [pidFindings, setPidFindings] =
    useState<string[]>(["Absent"]);

  const [redFlags, setRedFlags] =
    useState<string[]>(["None"]);

  const [dischargeType, setDischargeType] =
    useState("");

  const [
    cervicalDischargeType,
    setCervicalDischargeType,
  ] = useState("");

  const [uterusSize, setUterusSize] =
    useState("");

  const [
    uterusMobility,
    setUterusMobility,
  ] = useState("");

  const [
    adnexalMassSide,
    setAdnexalMassSide,
  ] = useState("");

  const [
    adnexalMassType,
    setAdnexalMassType,
  ] = useState("");

  const [
    otherFindings,
    setOtherFindings,
  ] = useState("");

  const toggleFinding = (
    item: string,
    selected: string[],
    setSelected: React.Dispatch<
      React.SetStateAction<string[]>
    >,
    normal = "Normal"
  ) => {
    if (item === normal) {
      setSelected([normal]);
      return;
    }

    let updated = selected.filter(
      (x) => x !== normal
    );

    if (updated.includes(item)) {
      updated = updated.filter(
        (x) => x !== item
      );
    } else {
      updated.push(item);
    }

    if (!updated.length)
      updated = [normal];

    setSelected(updated);
  };

  const toggleMulti = (
    item: string,
    selected: string[],
    setSelected: React.Dispatch<
      React.SetStateAction<string[]>
    >
  ) => {
    if (selected.includes(item)) {
      setSelected(
        selected.filter(
          (x) => x !== item
        )
      );
    } else {
      setSelected([
        ...selected,
        item,
      ]);
    }
  };

  const ChipGroup = ({
    items,
    selected,
    setSelected,
    normal = "Normal",
  }: {
    items: string[];
    selected: string[];
    setSelected: React.Dispatch<
      React.SetStateAction<string[]>
    >;
    normal?: string;
  }) => (
    <View style={styles.row}>
      {items.map((item) => (
        <AppChip
          key={item}
          label={item}
          selected={selected.includes(item)}
          onPress={() =>
            toggleFinding(
              item,
              selected,
              setSelected,
              normal
            )
          }
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        External Genitalia
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Discharge",
          "Ulcer",
          "Mass",
          "Warts",
          "Tenderness",
          "Bartholin Cyst",
          "Bartholin Abscess",
          "Pigmented Lesion",
        ]}
        selected={externalFindings}
        setSelected={
          setExternalFindings
        }
      />

      {externalFindings.includes(
        "Discharge"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Discharge Type
          </Text>

          <View style={styles.row}>
            {[
              "White",
              "Yellow",
              "Green",
              "Bloody",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  dischargeType === item
                }
                onPress={() =>
                  setDischargeType(item)
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Vaginal Examination
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Atrophy",
          "Tenderness",
          "Mass",
        ]}
        selected={vaginalFindings}
        setSelected={
          setVaginalFindings
        }
      />

      <Text style={styles.sectionTitle}>
        Cervix
      </Text>
            <ChipGroup
        items={[
          "Healthy",
          "Erosion",
          "Polyp",
          "Cervicitis",
          "Discharge",
          "Bleeding",
          "Growth",
        ]}
        selected={cervixFindings}
        setSelected={setCervixFindings}
        normal="Healthy"
      />

      {cervixFindings.includes(
        "Discharge"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Cervical Discharge
          </Text>

          <View style={styles.row}>
            {[
              "Mucoid",
              "Purulent",
              "Bloody",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  cervicalDischargeType ===
                  item
                }
                onPress={() =>
                  setCervicalDischargeType(
                    item
                  )
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Uterus
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Bulky",
          "Tender",
          "Retroverted",
          "Restricted Mobility",
        ]}
        selected={uterusFindings}
        setSelected={setUterusFindings}
      />

      <AppTextField
        label="Uterus Size"
        value={uterusSize}
        onChangeText={setUterusSize}
        placeholder="e.g. 8 weeks"
      />

      <Text style={styles.label}>
        Mobility
      </Text>

      <View style={styles.row}>
        {[
          "Normal",
          "Restricted",
          "Fixed",
        ].map((item) => (
          <AppChip
            key={item}
            label={item}
            selected={
              uterusMobility === item
            }
            onPress={() =>
              setUterusMobility(item)
            }
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        Adnexa
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Tenderness",
          "Mass",
        ]}
        selected={adnexalFindings}
        setSelected={setAdnexalFindings}
      />

      {adnexalFindings.includes(
        "Mass"
      ) && (
        <View style={styles.group}>
          <Text style={styles.label}>
            Side
          </Text>

          <View style={styles.row}>
            {[
              "Right",
              "Left",
              "Bilateral",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  adnexalMassSide === item
                }
                onPress={() =>
                  setAdnexalMassSide(item)
                }
              />
            ))}
          </View>

          <Text style={styles.label}>
            Consistency
          </Text>

          <View style={styles.row}>
            {[
              "Cystic",
              "Solid",
              "Mixed",
            ].map((item) => (
              <AppChip
                key={item}
                label={item}
                selected={
                  adnexalMassType === item
                }
                onPress={() =>
                  setAdnexalMassType(item)
                }
              />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Fornices
      </Text>

      <ChipGroup
        items={[
          "Normal",
          "Tender",
          "Fullness",
          "Mass",
        ]}
        selected={fornixFindings}
        setSelected={setFornixFindings}
      />
            <Text style={styles.sectionTitle}>
        Pelvic Organ Prolapse
      </Text>

      <ChipGroup
        items={[
          "Absent",
          "Cystocele",
          "Rectocele",
          "Uterine Prolapse",
          "Vault Prolapse",
        ]}
        selected={prolapseFindings}
        setSelected={setProlapseFindings}
        normal="Absent"
      />

      <Text style={styles.sectionTitle}>
        PID Signs
      </Text>

      <ChipGroup
        items={[
          "Absent",
          "Cervical Motion Tenderness",
          "Adnexal Tenderness",
          "Uterine Tenderness",
        ]}
        selected={pidFindings}
        setSelected={setPidFindings}
        normal="Absent"
      />

      <Text style={styles.sectionTitle}>
        Red Flags
      </Text>

      <ChipGroup
        items={[
          "None",
          "Active Heavy Bleeding",
          "Large Pelvic Mass",
          "Severe Pelvic Tenderness",
          "Suspicious Cervical Growth",
          "Foul Discharge",
        ]}
        selected={redFlags}
        setSelected={setRedFlags}
        normal="None"
      />

      <AppTextField
        value={otherFindings}
        onChangeText={setOtherFindings}
        placeholder="Add other findings..."
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  sectionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  label: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  group: {
    gap: SPACING.sm,
  },
});