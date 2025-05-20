// src/hooks/useRecipes.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

export interface Recipe {
  recipesId: number;
  title: string;
  image: string;
  description: string;
  time: string;
  ingredients: string;
  steps: string;
  tips: string;
  creationDate: string;
  difficultyId: number;
  categoryId: number;
  userId: number;
}

const BASE_URL = 'http://ecodelicias.somee.com/api/ControllerRecipes'; // Cambia esto a tu URL real

const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resp = await axios.get<Recipe[]>(BASE_URL);
        setRecipes(resp.data);
      } catch (err) {
        setError('Error al cargar las recetas');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const createRecipe = async (recipe: Omit<Recipe, 'recipesId'>): Promise<boolean> => {
    try {
      const resp = await axios.post(BASE_URL, recipe);
      setRecipes(prev => [...prev, resp.data]);
      return true;
    } catch (err) {
      setError('Error al crear la receta');
      return false;
    }
  };

  const updateRecipe = async (recipe: Recipe): Promise<boolean> => {
    try {
      await axios.put(BASE_URL, recipe);
      setRecipes(prev => prev.map(r => (r.recipesId === recipe.recipesId ? recipe : r)));
      return true;
    } catch (err) {
      setError('Error al actualizar la receta');
      return false;
    }
  };

  const deleteRecipe = async (id: number): Promise<boolean> => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setRecipes(prev => prev.filter(r => r.recipesId !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar la receta');
      return false;
    }
  };

  return {
    recipes,
    loading,
    error,
    createRecipe,
    updateRecipe,
    deleteRecipe,
  };
};

export default useRecipes;
