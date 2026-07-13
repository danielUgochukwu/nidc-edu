import { createClient } from "@supabase/supabase-js";

let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase environment variables are not set");
  }

  supabaseInstance = createClient(supabaseUrl, serviceRoleKey);
  return supabaseInstance;
}

export const supabase = new Proxy({} as any, {
  get(_, prop) {
    return Reflect.get(getSupabaseClient(), prop);
  },
}) as ReturnType<typeof createClient>;

export type StorageBucket =
  | "application-attachments"
  | "identity-documents"
  | "grant-documents"
  | "expenditure-receipts"
  | "mentor-avatars";

export async function uploadFile({
  bucket,
  path,
  file,
  contentType,
}: {
  bucket: StorageBucket;
  path: string;
  file: Buffer | Blob;
  contentType: string;
}): Promise<string> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType, upsert: false });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  return path;
}

export async function getSignedUrl({
  bucket,
  path,
  expiresIn = 3600,
}: {
  bucket: StorageBucket;
  path: string;
  expiresIn?: number;
}): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error || !data) {
    throw new Error(`Failed to generate signed URL: ${error?.message}`);
  }

  return data.signedUrl;
}
