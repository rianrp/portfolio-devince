import { useRef, useState } from "react";
import { myProjects } from "../constants";
import { motion, useInView } from "motion/react";
import ProjectDetails from "../components/ProjectDetails";

const Projects = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [selectedProject, setSelectedProject] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section ref={sectionRef} className="c-space section-spacing" id="work">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        className="text-heading"
      >
        My Selected Projects
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex flex-col gap-8 mt-12"
      >
        {myProjects.map((project, index) => (
          <motion.div
            key={project.id}
            variants={cardVariants}
            whileHover={{ scale: 1.01 }}
            className="relative w-full group"
          >
            {/* Card with Border */}
            <div className="relative border-2 border-white/80 rounded-[2.5rem] p-6 md:p-8 bg-#00000000/80 backdrop-blur-sm overflow-hidden">
              {/* Top Section - Number and Info */}
              <div className="flex items-start justify-between mb-6 md:mb-6">
                {/* Left - Number and Title */}
                <div className="flex items-center gap-4">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: index * 0.25 + 0.3, duration: 0.5, type: "spring" }}
                    className="text-4xl md:text-5xl font-bold text-white"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </motion.span>
                  <div>
                    <p className="text-xs md:text-sm text-gray-400 uppercase tracking-wider">
                      {project.tags?.[0]?.name || "PROJECT"}
                    </p>
                    <h3 className="text-lg md:text-xl font-semibold text-white mt-1">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Right - Live Project Button (Desktop Only) */}
                <motion.button
                  onClick={() => setSelectedProject(project)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:flex px-5 py-2.5 text-xs md:text-sm font-semibold text-white border-2 border-white/80 rounded-full hover:bg-white hover:text-black transition-all duration-300"
                >
                  LIVE PROJECT
                </motion.button>
              </div>

              {/* Image Grid - Desktop: 1 large + 2 small | Mobile: 1 image only */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 h-[300px] md:h-[400px]">
                {/* Large Image - Left (or single on mobile) */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative col-span-1 md:row-span-2 overflow-hidden rounded-2xl md:rounded-3xl"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </motion.div>

                {/* Small Images - Right (Desktop Only) */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden rounded-2xl md:rounded-3xl hidden md:block"
                >
                  <img
                    src={project.image}
                    alt={`${project.title} detail 1`}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden rounded-2xl md:rounded-3xl hidden md:block"
                >
                  <img
                    src={project.image}
                    alt={`${project.title} detail 2`}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </motion.div>
              </div>

              {/* Mobile - Live Project Button (Full Width Below Image) */}
              <motion.button
                onClick={() => setSelectedProject(project)}
                whileTap={{ scale: 0.95 }}
                className="md:hidden w-full mt-4 py-3 text-sm font-semibold text-white border-2 border-white/80 rounded-full hover:bg-white hover:text-black transition-all duration-300"
              >
                LIVE PROJECT
              </motion.button>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none rounded-[2.5rem]" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetails
          title={selectedProject.title}
          description={selectedProject.description}
          subDescription={selectedProject.subDescription}
          image={selectedProject.image}
          tags={selectedProject.tags}
          href={selectedProject.href}
          closeModal={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};

export default Projects;
