import { motion } from 'framer-motion'

/**
 * Scroll-triggered reveal used across the site so every section animates in
 * with the same rhythm. Purely presentational.
 */
const Reveal = ({
  children,
  as = 'div',
  delay = 0,
  y = 26,
  duration = 0.8,
  className = '',
  once = true,
  ...rest
}) => {
  const MotionTag = motion[as] || motion.div

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.2, 0.7, 0.2, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

export const stagger = (index, step = 0.08) => index * step

export default Reveal
