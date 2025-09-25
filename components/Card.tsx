import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  // Fix: Add style prop to allow passing inline styles for animations. This resolves type errors in HomePage and ProgressPage.
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = '', style }) => {
  return (
    <div className={`bg-secondary-light dark:bg-secondary rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`} style={style}>
      {children}
    </div>
  );
};

export default React.memo(Card);