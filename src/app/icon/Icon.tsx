import React, { HTMLAttributes, Suspense, useMemo } from "react";
import { IconName, loadIcon } from "./IconName";

interface Props extends HTMLAttributes<HTMLDivElement> {
  name: IconName;
  fill?: string;
}

export const Icon = ({ name, fill, ...args }: Props) => {

  const SvgIcon = useMemo(() => loadIcon(name), [name]);

  return (
    SvgIcon && <div
      className="icon"
      aria-label={name}
      role="img"
      {...args}
    >
      <Suspense fallback={null}>
        <SvgIcon style={{ fill }} />
      </Suspense>
    </div>
  );
};
