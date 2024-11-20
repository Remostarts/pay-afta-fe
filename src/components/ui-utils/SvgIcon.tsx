// SvgIcon.jsx
import React, { HTMLProps } from 'react';

type SvgIconProps = HTMLProps<HTMLSpanElement> & {
  svgContent: string;
};

const SvgIcon: React.FC<SvgIconProps> = ({ svgContent, className, ...props }) => (
  <span className={className} dangerouslySetInnerHTML={{ __html: svgContent }} {...props} />
);

export default SvgIcon;
