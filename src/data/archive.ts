import project1 from "@/assets/project-switcheats.jpg";
import project2 from "@/assets/project-homster.jpg";
import project3 from "@/assets/project-bhookingo.jpg";

export interface ArchiveProject {
  id: string;
  year: string;
  title: string;
  category: string;
  tech: string[];
  image: string;
  liveUrl: string;
  githubUrl: string;
  desc: string;
}

export const allProjects: ArchiveProject[] = [
  {
    id: "01", year: "2026", title: "SWITCHEATS", category: "Food Delivery Platform",
    tech: ["MERN Stack", "Socket.io", "Razorpay", "Google Maps API", "Firebase FCM", "Docker"], image: project1, liveUrl: "https://switcheats.com", githubUrl: "#",
    desc: "Production-grade food delivery platform serving 6,000+ users, 80+ restaurants and 50+ delivery partners. Secure APIs, payments, maps and push notifications, deployed on a Linux VPS with Nginx, PM2 and SSL."
  },
  {
    id: "02", year: "2025", title: "HOMSTER", category: "Home Services App",
    tech: ["MERN Stack", "Socket.io", "Maps API", "Billing"], image: project2, liveUrl: "https://homster.in", githubUrl: "#",
    desc: "Home services platform connecting users with providers for plumbing, electrical, repair and installation. Separate user and vendor workflows, real-time booking updates, live provider tracking and dynamic billing."
  },
  {
    id: "03", year: "2026", title: "BHOOKINGO", category: "Highway Food Delivery",
    tech: ["MERN Stack", "Maps API", "Live Location"], image: project3, liveUrl: "https://bhookingo.in", githubUrl: "#",
    desc: "Food delivery app built for highway travellers. While you travel, it shows restaurants on the road ahead of you, so you can order food along your route."
  }
];

const years = allProjects.map((p) => Number(p.year));
export const archiveYearRange = `${Math.min(...years)}—${Math.max(...years)}`;
