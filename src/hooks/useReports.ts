// src/hooks/useReports.ts

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export interface User {
  userId: number;
  countryId: number;
}

export interface Category {
  categoryId: number;
  category: string;
}

export interface Difficulty {
  difficultyId: number;
  difficulty: string;
}

export interface Recipe {
  recipesId: number;
  title: string;
  categoryId: number;
  difficultyId: number;
  userId: number;
}

export interface Country {
  countryId: number;
  country: string;
}

export interface AdminReportData {
  totalUsers: number;
  totalCategories: number;
  totalCountries: number;
  totalDifficulties: number;
  recipes: Recipe[];
  categories: Category[];
  difficulties: Difficulty[];
  countries: Country[];
  users: User[]; // se incluye para usar su countryId
}

const API = "https://ecodelicias.somee.com/api";

const useReports = () => {
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
        recipesRes
      ] = await Promise.all([
        axios.get<User[]>(`${API}/ControllerUser`),
        axios.get<Category[]>(`${API}/ControllerCategory`),
        axios.get<Country[]>(`${API}/ControllerCountry`),
        axios.get<Difficulty[]>(`${API}/ControllerDifficulty`),
        axios.get<Recipe[]>(`${API}/ControllerRecipes`)
      ]);

      setData({
        totalUsers: usersRes.data.length,
        totalCategories: categoriesRes.data.length,
        totalCountries: countriesRes.data.length,
        totalDifficulties: difficultiesRes.data.length,
        recipes: recipesRes.data,
        categories: categoriesRes.data,
        difficulties: difficultiesRes.data,
        countries: countriesRes.data,
        users: usersRes.data,
      });
    } catch (err) {
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
