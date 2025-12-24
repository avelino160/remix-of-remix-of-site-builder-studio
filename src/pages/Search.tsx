import { AppLayout } from "@/components/AppLayout";

const SearchPage = () => {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Buscar projetos</h1>
        <p className="text-sm text-muted-foreground">
          Aqui você vai poder pesquisar entre todos os sites já criados. (Em breve)
        </p>
      </div>
    </AppLayout>
  );
};

export default SearchPage;
