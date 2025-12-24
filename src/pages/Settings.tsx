import { AppLayout } from "@/components/AppLayout";

const SettingsPage = () => {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Em breve você poderá gerenciar preferências da sua conta e do workspace aqui.
        </p>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
