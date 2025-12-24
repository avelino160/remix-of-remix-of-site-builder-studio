import { AppLayout } from "@/components/AppLayout";

const FavoritesPage = () => {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Favoritos</h1>
        <p className="text-sm text-muted-foreground">
          Em breve você poderá ver aqui os sites marcados como favoritos.
        </p>
      </div>
    </AppLayout>
  );
};

export default FavoritesPage;
