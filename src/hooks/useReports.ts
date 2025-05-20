// src/hooks/useReports.ts
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
//import { useAuth } from "../Context/AuthContext";

export interface AdminReportData {
  totalUsers: number;
  totalCategories: number;
  totalCountries: number;
  totalDifficulties: number;
}

export const useReports = () => {
  //const { state } = useAuth();
  //const userType = state.user?.userType;

  const [data, setData] = useState<AdminReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        usersRes,
        categoriesRes,
        countriesRes,
        difficultiesRes,
      ] = await Promise.all([
        axios.get<User[]>("http://ecodelicias.somee.com/api/ControllerUser"),
        axios.get<Category[]>("http://ecodelicias.somee.com/api/ControllerCategory"),
        axios.get<Country[]>("http://ecodelicias.somee.com/api/ControllerCountry"),
        axios.get<Difficulty[]>("http://ecodelicias.somee.com/api/ControllerDifficulty"),
      ]);

      const totalUsers = usersRes.data.length;
      const totalCategories = categoriesRes.data.length;
      const totalCountries = countriesRes.data.length;
      const totalDifficulties = difficultiesRes.data.length;

      setData({ totalUsers, totalCategories, totalCountries, totalDifficulties });
    } catch (err: any) {
      console.error("Error al obtener reportes:", err);
      setError("No se pudieron cargar los reportes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { data, loading, error, refresh: fetchReports };
};

export default useReports;

// Tipos auxiliares
interface User {
  userId: number;
}
interface Category {
  categoryId: number;
}
interface Country {
  countryId: number;
}
interface Difficulty {
  difficultyId: number;
}
