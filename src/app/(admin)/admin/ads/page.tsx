import { getAds } from "@/lib/supabase/queries";
import { AdsClient } from "./AdsClient";

export default async function AdminAdsPage() {
  const ads = await getAds();
  return <AdsClient initialAds={ads} />;
}
