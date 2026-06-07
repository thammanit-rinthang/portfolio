import type { Metadata } from "next";
import { getPublishedProfile } from "../_lib/data";
import { ContactContent } from "../_components/contact-content";
import { ui } from "../_lib/locale";

export const metadata: Metadata = {
  title: ui.metadata.contact.title.en,
  description: ui.metadata.contact.description.en,
};

export default async function ContactPage() {
  const profile = await getPublishedProfile();
  return <ContactContent profile={profile} />;
}
