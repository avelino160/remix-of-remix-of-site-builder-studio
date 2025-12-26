import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useUserCredits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCredits = async () => {
    if (!user) {
      setCredits(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_credits")
        .select("balance")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // If no record exists, create one with default 5 credits
        const { data: newData, error: insertError } = await supabase
          .from("user_credits")
          .insert({ user_id: user.id, balance: 5 })
          .select("balance")
          .single();

        if (insertError) throw insertError;
        setCredits(newData.balance);
      } else {
        setCredits(data.balance);
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
      setCredits(null);
    } finally {
      setLoading(false);
    }
  };

  const deductCredit = async () => {
    if (!user || credits === null || credits <= 0) return false;

    try {
      const { error } = await supabase
        .from("user_credits")
        .update({ balance: credits - 0.5 })
        .eq("user_id", user.id);

      if (error) throw error;

      setCredits(credits - 0.5);
      return true;
    } catch (error) {
      console.error("Error deducting credit:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [user]);

  return { credits, loading, refetch: fetchCredits, deductCredit };
};
