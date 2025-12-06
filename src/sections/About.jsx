import { useRef } from "react";
import { motion, useInView } from "motion/react";
import Card from "../components/Card";
import { Globe } from "../components/globe";
import { Frameworks } from "../components/frameWorks";

const About = () => {
  const grid2Container = useRef();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section ref={sectionRef} className="c-space section-spacing" id="about">
      <motion.h2
        variants={titleVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="text-heading"
      >
        About Me
      </motion.h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[18rem] mt-12"
      >
        {/* Grid 1 */}
        <motion.div
          variants={itemVariants}
          className="flex items-end grid-default-color grid-1"
        >
          <img
            src="assets/coding-pov.png"
            className="absolute scale-[1.75] -right-[5rem] -top-[1rem] md:scale-[3] md:left-50 md:inset-y-10 lg:scale-[2.5]"
          />
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="z-10"
          >
            <p className="headtext">Hi, I'm Devince</p>
            <p className="subtext">
              Engenheiro de Software Full Stack com experiência em desenvolvimento web e mobile, 
              arquitetura de sistemas, IA aplicada, automação cognitiva e soluções SaaS completas.
            </p>
          </motion.div>
          <div className="absolute inset-x-0 pointer-evets-none -bottom-4 h-1/2 sm:h-1/3 bg-gradient-to-t from-indigo" />
        </motion.div>
        {/* Grid 2 */}
        <motion.div
          variants={itemVariants}
          className="grid-default-color grid-2"
        >
          <div
            ref={grid2Container}
            className="flex items-center justify-center w-full h-full"
          >
            <p className="flex items-end text-5xl text-gray-500">
              CODE IS CRAFT
            </p>
            <Card
              style={{ rotate: "75deg", top: "30%", left: "20%" }}
              text="GRASP"
              containerRef={grid2Container}
            />
            <Card
              style={{ rotate: "-30deg", top: "60%", left: "45%" }}
              text="SOLID"
              containerRef={grid2Container}
            />
            <Card
              style={{ rotate: "90deg", bottom: "30%", left: "70%" }}
              text="Design Patterns"
              containerRef={grid2Container}
            />
            <Card
              style={{ rotate: "-45deg", top: "55%", left: "0%" }}
              text="Design Principles"
              containerRef={grid2Container}
            />
            <Card
              style={{ rotate: "20deg", top: "10%", left: "38%" }}
              text="SRP"
              containerRef={grid2Container}
            />
            <Card
              style={{ rotate: "30deg", top: "70%", left: "70%" }}
              image="assets/logos/csharp-pink.png"
              containerRef={grid2Container}
            />
            <Card
              style={{ rotate: "-45deg", top: "70%", left: "25%" }}
              image="assets/logos/dotnet-pink.png"
              containerRef={grid2Container}
            />
            <Card
              style={{ rotate: "-45deg", top: "5%", left: "10%" }}
              image="assets/logos/blazor-pink.png"
              containerRef={grid2Container}
            />
          </div>
        </motion.div>
        {/* Grid 3 */}
        <motion.div
          variants={itemVariants}
          className="grid-black-color grid-3"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="z-10 w-[50%]"
          >
            <p className="headtext">Time Zone</p>
            <p className="subtext">
              Baseado no Brasil, atuo com projetos corporativos e próprios, disponível para trabalho remoto
            </p>
          </motion.div>
          <motion.figure
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -180 }}
            transition={{ delay: 0.9, duration: 1, ease: "easeOut" }}
            className="absolute left-[30%] top-[10%]"
          >
            <Globe />
          </motion.figure>
        </motion.div>
        {/* Grid 4 */}
        <motion.div
          variants={itemVariants}
          className="grid-4 bg-gradient-to-br from-green-600/20 via-green-500/10 to-emerald-600/20 rounded-3xl backdrop-blur-sm border border-green-500/20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col items-center justify-center gap-6 size-full"
          >
            <p className="text-center text-2xl md:text-3xl font-bold text-white">
              Quer desenvolver um projeto juntos?
            </p>
            <motion.a
              href="https://wa.me/+554896489686?text=Olá%20Devince,%20vim%20pelo%20seu%20portfólio!"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg hover:shadow-green-500/50 hover:from-green-600 hover:to-green-700 transition-all duration-300"
            >
              <svg 
                className="w-6 h-6" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Chamar no WhatsApp
            </motion.a>
          </motion.div>
        </motion.div>
        {/* Grid 5 */}
        <motion.div
          variants={itemVariants}
          className="grid-default-color grid-5"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="z-10 w-[50%]"
          >
            <p className="headText">Tech Stack</p>
            <p className="subtext">
              Especializado em React, React Native, Flutter, .NET 6, Azure, AWS, IA aplicada, 
              automação e arquiteturas escaláveis para sistemas corporativos e SaaS
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute inset-y-0 md:inset-y-9 w-full h-full start-[50%] md:scale-125"
          >
            <Frameworks />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;
