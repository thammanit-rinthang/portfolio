import type { Metadata } from "next";
import { ui } from "./_lib/locale";
import { 
  getPublishedProfile, 
  getPublishedSkills, 
  getPublishedExperiences, 
  getPublishedProjects 
} from "./_lib/data";
import { HomeContent } from "./_components/home-content";

export const metadata: Metadata = {
  title: ui.metadata.home.title.en,
  description: ui.metadata.home.description.en,
};

export default async function Home() {
  const [profile, skills, experiences, featuredProjects] = await Promise.all([
    getPublishedProfile(),
    getPublishedSkills(),
    getPublishedExperiences(),
    getPublishedProjects(true),
  ]);

  return (
    <HomeContent
      profile={profile}
      skills={skills}
      experiences={experiences}
      featuredProjects={featuredProjects}
    />
  );
}
