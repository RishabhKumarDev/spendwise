import { useAppDispatch } from "@/app/hook";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { logout } from "@/features/auth/authSlice";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import { Loader } from "lucide-react";
import { useTransition } from "react";
import { useNavigate } from "react-router-dom";

type LogoutDialogProp = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};
function LogoutDialog({ isOpen, setIsOpen }: LogoutDialogProp) {
  const [isPending, startTransition] = useTransition();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    startTransition(() => {
      setIsOpen(false);
      dispatch(logout());
      navigate(AUTH_ROUTES.SIGN_IN);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to log out?</DialogTitle>
          <DialogDescription>
            This will end your current session and you will need to log in again
            to access your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            className="text-white !bg-red-500"
            onClick={handleLogout}
            disabled={isPending}
          >
            {isPending && <Loader className="animate-spin" />}
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LogoutDialog;
