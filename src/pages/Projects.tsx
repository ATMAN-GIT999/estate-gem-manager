import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProjectsSection from "@/components/ProjectsSection";
import PageWrapper from "@/components/PageWrapper";

/**
 * No longer in the header — the work now also appears as a section on the
 * property management page, which is where an owner meets it. The route stays
 * so existing links and search results keep resolving, and it renders the same
 * component so the two can never drift apart.
 */
const ProjectsContent = () => (
  <div className="min-h-screen flex flex-col">
    <Navigation />
    <main className="flex-1 pt-24 pb-12">
      <ProjectsSection headingAs="h1" />
    </main>
    <Footer />
  </div>
);

const Projects = () => (<PageWrapper slug="site--projects"><ProjectsContent /></PageWrapper>);
export default Projects;
