import { useTypedSelector } from "@/app/hook";
import Logo from "@/components/logo/logo";
import LogoutDialog from "@/components/navbar/logout-dialog";
import UserNav from "@/components/navbar/user-nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { Menu } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
function Navbar() {
  const { pathname } = useLocation();
  const { user } = useTypedSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const routes = [
    {
      href: PROTECTED_ROUTES.OVERVIEW,
      label: "Overview",
    },
    {
      href: PROTECTED_ROUTES.TRANSACTIONS,
      label: "Transactions",
    },
    {
      href: PROTECTED_ROUTES.REPORTS,
      label: "Reports",
    },
    {
      href: PROTECTED_ROUTES.SETTINGS,
      label: "Settings",
    },
  ];
  return (
    <>
      <header
        className={cn(
          "w-full px-4 py-3 pb-3 lg:px-14 bg-[var(--secondary-dark-color)] text-white",
        )}
      >
        <div className="flex w-full h-14 max-w-[var(--max-width)] items-center mx-auto">
          <div className="flex items-center justify-between w-full ">
            {/* left side -(logo, menu) */}
            <div className="flex items-center gap-4 ">
              <Button
                variant="ghost"
                size="icon"
                className="inline-flex md:hidden !cursor-pointer
               !bg-white/10 !text-white hover:bg-white/10"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </Button>
              <Logo />
            </div>
            {/*middle/navigation -(desktop, mobile) */}
            {/* desktop navigation */}
            <nav className="items-center hidden overflow-x-auto md:flex gap-x-2 ">
              {routes.map((route) => (
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    `w-auto font-normal py-4.5 hover:text-white border-none text-white/60 focus:bg-white/30 transition !bg-transparent !text-sm`,
                    pathname === route.href && "text-white",
                  )}
                  asChild
                  key={route.href}
                >
                  <NavLink key={route.href} to={route.href}>
                    {route.label}
                  </NavLink>
                </Button>
              ))}
            </nav>

            {/* mobile navigation */}
            <Sheet onOpenChange={setIsOpen} open={isOpen}>
              <SheetContent side="left">
                <nav className="flex flex-col gap-y-2 pt-9">
                  {routes.map((route) => (
                    <Button
                      size="sm"
                      variant="ghost"
                      className={cn(
                        `w-full font-normal py-4.5
                       hover:bg-white/10 hover:text-black border-none
                       text-black/70 focus:bg-white/30
                       transtion !bg-transparent justify-start`,
                        pathname === route.href && "!bg-black/10 text-black",
                      )}
                      asChild
                      key={route.href}
                    >
                      <NavLink key={route.href} to={route.href}>
                        {route.label}
                      </NavLink>
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* right side - (user actions) */}
            <div className="flex items-center">
              <UserNav
                userName={user?.name || ""}
                profilePicture={user?.profilePicture || ""}
                onLogout={() => setIsLogoutDialogOpen(true)}
              />
            </div>
          </div>
        </div>
      </header>
      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        setIsOpen={setIsLogoutDialogOpen}
      />
    </>
  );
}

export default Navbar;
