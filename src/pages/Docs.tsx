import { AppLayout } from "@/components/AppLayout";

const DocsPage = () => {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Documentação</h1>
        <p className="text-sm text-muted-foreground">
          Links e tutoriais sobre como usar o construtor de sites. (Em breve)
        </p>
      </div>
    </AppLayout>
  );
};

export default DocsPage;
