// generate_metadata.ts
import * as fs from "fs";
import * as path from "path";
import JSZip from "jszip";

// ----- Configuration -----
// Counts adjusted for total = 2439
const CRUSADER_COUNT = 6;
const GUARDIAN_COUNT = 69;
const WARRIOR_COUNT = 666;
const KNIGHT_COUNT = 1698; // change back to 1898 if you want 2639

const TOTAL = CRUSADER_COUNT + GUARDIAN_COUNT + WARRIOR_COUNT + KNIGHT_COUNT;
if (TOTAL !== 2439) {
  console.error(
    `⚠️ Configured total is ${TOTAL}, expected 2439. Edit counts if needed.`,
  );
}

// Media links and descriptions
interface NFTClass {
  animation_url: string;
  typeLabel: string;
  validation: number;
  voting: number;
  description: string;
}

const CLASSES: Record<string, NFTClass> = {
  Crusader: {
    animation_url:
      "https://bagtltlglmwbypzmnzvx.supabase.co/storage/v1/object/public/5CBC742D00/crusader.mp4",
    typeLabel: "Crusader",
    validation: 10,
    voting: 3,
    description:
      "This transcendent creation seamlessly weaves together the valor of a crusading knight with the cutting-edge ethos of the cypherpunk movement. A digital icon of unparalleled rarity, the Crusader NFT stands as a testament to the convergence of historical legacy.",
  },
  Guardian: {
    animation_url:
      "https://bagtltlglmwbypzmnzvx.supabase.co/storage/v1/object/public/5CBC742D00/guardian.mp4",
    typeLabel: "Guardian",
    validation: 5,
    voting: 2,
    description:
      "This digital masterpiece features a majestic guardian, wielding a pixelated shield and futuristic sword, standing as a sentinel against virtual threats. The perfect blend of medieval honor and cryptographic vigilance, this NFT is a rare gem in the vast sea of digital collectibles.",
  },
  Warrior: {
    animation_url:
      "https://bagtltlglmwbypzmnzvx.supabase.co/storage/v1/object/public/5CBC742D00/warrior.mp4",
    typeLabel: "Warrior",
    validation: 2,
    voting: 1,
    description:
      "A cybernetically enhanced champion ready for the battles of the blockchain realm. With a visage that combines battle-hardened warrior spirit and advanced technological augmentations, this NFT stands as a beacon of rarity, embodying ancient strength.",
  },
  Knight: {
    animation_url:
      "https://bagtltlglmwbypzmnzvx.supabase.co/storage/v1/object/public/5CBC742D00/knight.mp4",
    typeLabel: "Knight",
    validation: 1,
    voting: 1,
    description:
      "A fusion of classic chivalry and cutting-edge cypherpunk aesthetics. This NFT showcases a gallant knight clad in traditional armor adorned with intricate digital patterns, seamlessly blending the past, present and the future. An artifact on Ethereum Chain.",
  },
};

// ----- Output paths -----
const outDir = path.join(process.cwd(), "metadata");
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir);

// prepare CSV
const csvLines: string[] = ["tokenId,filename,type,animation_url"];

// NFT Metadata format
interface NFTMetadata {
  name: string;
  description: string;
  animation_url: string;
  attributes: { trait_type: string; value: string | number }[];
}

// helper to create one metadata object
function makeMetadata(
  tokenId: number,
  className: keyof typeof CLASSES,
): NFTMetadata {
  const cls = CLASSES[className];
  return {
    name: `xNFT #${tokenId}`,
    description: cls.description,
    animation_url: cls.animation_url,
    attributes: [
      { trait_type: "Type", value: cls.typeLabel },
      { trait_type: "Early Access Pass", value: "Yes" },
      { trait_type: "Event Invites", value: "Yes" },
      { trait_type: "Validation Rights", value: cls.validation },
      { trait_type: "Revenue Sharing", value: cls.validation },
      { trait_type: "Voting Rights", value: cls.voting },
    ],
  };
}

// Generate files
let id = 1;

function generateBatch(count: number, className: keyof typeof CLASSES) {
  for (let i = 0; i < count; i++) {
    const meta = makeMetadata(id, className);
    const filename = `${id}.json`;
    fs.writeFileSync(
      path.join(outDir, filename),
      JSON.stringify(meta, null, 2),
    );
    csvLines.push(`${id},${filename},${className},${meta.animation_url}`);
    id++;
  }
}

generateBatch(CRUSADER_COUNT, "Crusader");
generateBatch(GUARDIAN_COUNT, "Guardian");
generateBatch(WARRIOR_COUNT, "Warrior");
generateBatch(KNIGHT_COUNT, "Knight");

// Write CSV
fs.writeFileSync(path.join(outDir, "mapping.csv"), csvLines.join("\n"));

// Zip with jszip
async function createZip() {
  const zip = new JSZip();
  const folder = zip.folder("metadata");
  if (!folder) throw new Error("Could not create metadata folder in zip");

  // Add all files to zip
  const files = fs.readdirSync(outDir);
  for (const file of files) {
    const data = fs.readFileSync(path.join(outDir, file));
    folder.file(file, data);
  }

  // Generate zip
  const content = await zip.generateAsync({ type: "nodebuffer" });
  const zipPath = path.join(process.cwd(), "metadata.zip");
  fs.writeFileSync(zipPath, content);

  console.log("✅ Generated metadata files:", outDir);
  console.log("✅ mapping.csv created inside metadata/");
  console.log("✅ metadata.zip created:", zipPath);
  console.log(`Total files generated: ${TOTAL} (1..${TOTAL})`);
  console.log(
    "Next step: upload metadata.zip to NFT.Storage or Pinata and use ipfs://<CID>/",
  );
}

createZip().catch(console.error);
