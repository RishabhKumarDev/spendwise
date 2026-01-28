import { ReactNode } from "react";
import { Fragment } from "react/jsx-runtime";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  rightAction?: ReactNode;
  renderPageheader?: ReactNode;
}
function PageHeader({
  title,
  subtitle,
  rightAction,
  renderPageheader,
}: PageHeaderProps) {
  return (
   <div className="w-full pb-20 pt-4 px-5 lg:px-0 bg-[#1a1e2a] text-white">
        <div className="w-full max-w-[var(--max-width)]  mx-auto">
        {renderPageheader ? (
          <Fragment> {renderPageheader} </Fragment>
        ) : (
          <div className="">
            {(title || subtitle) && (
              <div className="space-y-1">
                {title && (
                  <h2 className="text-2xl lg:text-4xl font-medium">{title}</h2>
                )}
                {subtitle && (
                  <p className="text-white/60 text-sm">{subtitle} </p>
                )}
              </div>
            )}
            {rightAction && rightAction}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
