import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 50 }, // Comienza desde abajo
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }, // Llega a su posición normal
  exit: { opacity: 0, y: -50, transition: { duration: 0.5 } }, // Se va hacia arriba
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
