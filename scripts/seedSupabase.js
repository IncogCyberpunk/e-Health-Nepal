import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIG
const TABLE_NAME = "entitlements";
const DATA_FILE = path.join(__dirname, "../data/entitlements.json");

// Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

// Load JSON
const rawData = fs.readFileSync(DATA_FILE, "utf-8");
const records = JSON.parse(rawData);

if (!Array.isArray(records)) {
  throw new Error("JSON file must contain an array of objects");
}

// Insert
try {
  const { data, error } = await supabase.from(TABLE_NAME).insert(records);

  if (error) {
    console.error("Insert failed:", error);
  } else if (data) {
    console.log(`Inserted ${data.length} records into ${TABLE_NAME}`);
  } else {
    console.log("Insert returned no data, but no error");
  }
} catch (err) {
  console.error("Unexpected error:", err);
}
