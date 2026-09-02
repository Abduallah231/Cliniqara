import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

const CSV_URL =
  'https://raw.githubusercontent.com/karem505/egyptian-drug-database/main/data/egyptian-drugs.csv';

type GitHubDrugRow = {
  commercial_name_en?: string;
  commercial_name_ar?: string;
  scientific_name?: string;
  manufacturer?: string;
  drug_class?: string;
  route?: string;
  price_egp?: string;
};

function cleanString(
  value?: string,
): string | null {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  const cleaned = value.trim();

  if (
    !cleaned ||
    cleaned.toUpperCase() === 'N/A' ||
    cleaned.toUpperCase() === 'NULL'
  ) {
    return null;
  }

  return cleaned;
}

function parsePrice(
  value?: string,
): number | null {
  const cleaned =
    cleanString(value);

  if (!cleaned) {
    return null;
  }

  const normalized =
    cleaned.replace(
      /[^0-9.]/g,
      '',
    );

  if (!normalized) {
    return null;
  }

  const price =
    Number(normalized);

  return Number.isFinite(price)
    ? price
    : null;
}

async function main() {
  console.log(
    'Downloading drug database from GitHub...',
  );

  const response =
    await fetch(CSV_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to download CSV: ${response.status} ${response.statusText}`,
    );
  }

  const csv =
    await response.text();

  console.log(
    `Downloaded ${csv.length.toLocaleString()} characters.`,
  );

  const rows =
    parse(csv, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
      relax_column_count: true,
      trim: true,
    }) as GitHubDrugRow[];

  console.log(
    `Parsed ${rows.length.toLocaleString()} rows.`,
  );

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (
    let index = 0;
    index < rows.length;
    index++
  ) {
    const row = rows[index];

    const commercialNameEn =
      cleanString(
        row.commercial_name_en,
      );

    if (!commercialNameEn) {
      skipped++;

      continue;
    }

    const data = {
      commercialNameEn,

      commercialNameAr:
        cleanString(
          row.commercial_name_ar,
        ),

      scientificName:
        cleanString(
          row.scientific_name,
        ),

      manufacturer:
        cleanString(
          row.manufacturer,
        ),

      drugClass:
        cleanString(
          row.drug_class,
        ),

      route:
        cleanString(
          row.route,
        ),

      priceEgp:
        parsePrice(
          row.price_egp,
        ),

      source:
        'github-egyptian-drug-database',

      sourceRowKey:
        commercialNameEn,

      isActive: true,
    };

    const existing =
      await prisma.drug.findUnique({
        where: {
          commercialNameEn,
        },
        select: {
          id: true,
        },
      });

    if (existing) {
      await prisma.drug.update({
        where: {
          id: existing.id,
        },
        data,
      });

      updated++;
    } else {
      await prisma.drug.create({
        data,
      });

      inserted++;
    }

    if (
      (index + 1) % 500 === 0
    ) {
      console.log(
        `Processed ${(
          index + 1
        ).toLocaleString()} / ${rows.length.toLocaleString()}`,
      );
    }
  }

  console.log('');
  console.log(
    '================================',
  );
  console.log(
    'Drug import completed',
  );
  console.log(
    '================================',
  );
  console.log(
    `Total rows : ${rows.length}`,
  );
  console.log(
    `Inserted   : ${inserted}`,
  );
  console.log(
    `Updated    : ${updated}`,
  );
  console.log(
    `Skipped    : ${skipped}`,
  );
}

main()
  .catch((error) => {
    console.error(
      'Drug import failed:',
      error,
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });