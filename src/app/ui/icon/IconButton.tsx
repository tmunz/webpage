import './IconButton.css';
import React, { AnchorHTMLAttributes, ButtonHTMLAttributes, useId } from 'react';
import { IconName } from './IconName';
import { Icon } from './Icon';

interface CommonProps {
  name: IconName;
  iconColor?: string;
  tooltip?: string;
}

type Props = CommonProps & (
  (ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }) |
  (AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
);

export const IconButton = (props: Props) => {
  const tooltipId = useId();
  const tooltipText = props.tooltip ?? props.title;
  const description = [props['aria-describedby'], tooltipText ? tooltipId : undefined].filter(Boolean).join(' ') || undefined;
  const label = props['aria-label'] ?? (typeof props.children === 'string'
    ? props.children
    : props.children ? undefined : tooltipText ?? props.name);
  const buttonClassName = ['icon-button', props.children ? 'icon-button--labelled' : undefined, props.className].filter(Boolean).join(' ');
  const content = <>
    <span className="icon-button-frame" style={{ color: props.iconColor === 'none' ? undefined : props.iconColor }}>
      <Icon name={props.name} fill={props.iconColor ?? 'currentColor'} aria-hidden="true" />
    </span>
    {props.children && <span className="icon-button-label">{props.children}</span>}
    {tooltipText && <span className="icon-button-tooltip" role="tooltip" id={tooltipId}>
      {tooltipText}
    </span>}
  </>;

  if (typeof props.href === 'string') {
    const { name, iconColor, tooltip, title, className, children, href, ...args } = props;
    return <a className={buttonClassName} href={href}
      target="_blank" rel="noopener noreferrer" {...args} aria-label={label} aria-describedby={description}>
      {content}
    </a>;
  }

  const { name, iconColor, tooltip, title, className, children, ...args } = props;
  return <button type="button" className={buttonClassName} {...args}
    aria-label={label} aria-describedby={description}>
    {content}
  </button>;
};
