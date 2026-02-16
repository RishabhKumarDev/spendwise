import PageHeader from "@/components/page-header";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  rightAction?: ReactNode;
  showHeader?: boolean;
  addMarginTop?: boolean;
  renderPageHeader?: ReactNode;
}
function PageLayout({
  children,
  className,
  title,
  subtitle,
  rightAction,
  showHeader = true,
  addMarginTop = false,
  renderPageHeader,
}: PageLayoutProps) {
  return (
    <div>
      {showHeader && (
        <PageHeader
          title={title}
          subtitle={subtitle}
          rightAction={rightAction}
          renderPageheader={renderPageHeader}
        />
      )}
      <div
        className={cn(
          "w-full max-w-[var(--max-width)] mx-auto pt-8",
          addMarginTop && "-mt-20",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
