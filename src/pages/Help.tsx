import { AppLayout } from "@/components/AppLayout";

const HelpPage = () => {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Ajuda</h1>
        <p className="text-sm text-muted-foreground">
          Central de ajuda com perguntas frequentes e contato de suporte. (Em breve)
        </p>
      </div>
    </AppLayout>
  );
};

export default HelpPage;
