import type { Metadata } from "next";
import { getPublishedProfile, getPublishedExperiences, getPublishedSkills } from "../_lib/data";
import { ResumeContent } from "../_components/resume-content";
import { ui } from "../_lib/locale";

export const metadata: Metadata = {
  title: ui.metadata.resume.title.en,
  description: ui.metadata.resume.description.en,
};

export default async function ResumePage() {
  const [profile, experiences, skills] = await Promise.all([
    getPublishedProfile(),
    getPublishedExperiences(),
    getPublishedSkills(),
  ]);
  return <ResumeContent profile={profile} experiences={experiences} skills={skills} />;
}
