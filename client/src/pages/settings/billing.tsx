import { Separator } from "@/components/ui/separator";

const Billing = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>
      <Separator />

      <div className="w-full">
        <h2>Comming Soon...</h2>
        <h4>Learning how RazorPay works...</h4>
      </div>
    </div>
  );
};

export default Billing;
