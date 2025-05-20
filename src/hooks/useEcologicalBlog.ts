// src/hooks/useEcologicalBlogs.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

export type EcologicalBlog = {
  ecologicalBlogId: number;
  title: string;
  image: string;
  discover: string;
  description: string;
  postDate: string;
  userId: number;
};

const BASE_URL = 'https://ecodelicias.somee.com/api/ControllerEcologicalBlog';

const useEcologicalBlogs = () => {
  const [blogs, setBlogs] = useState<EcologicalBlog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resp = await axios.get<EcologicalBlog[]>(BASE_URL);
        setBlogs(resp.data);
      } catch (err) {
        setError("Error al cargar los blogs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const createBlog = async (blog: Omit<EcologicalBlog, 'ecologicalBlogId'>): Promise<boolean> => {
    try {
      const resp = await axios.post<EcologicalBlog>(BASE_URL, blog, {
        headers: { 'Content-Type': 'application/json' }
      });
      setBlogs(prev => [...prev, resp.data]);
      return true;
    } catch (err) {
      setError("Error al crear el blog");
      console.error(err);
      return false;
    }
  };

  const updateBlog = async (blog: EcologicalBlog): Promise<boolean> => {
    try {
      await axios.put(BASE_URL, blog, {
        headers: { 'Content-Type': 'application/json' }
      });
      setBlogs(prev =>
        prev.map(b => (b.ecologicalBlogId === blog.ecologicalBlogId ? blog : b))
      );
      return true;
    } catch (err) {
      setError("Error al actualizar el blog");
      console.error(err);
      return false;
    }
  };

  const deleteBlog = async (id: number): Promise<boolean> => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setBlogs(prev => prev.filter(b => b.ecologicalBlogId !== id));
      return true;
    } catch (err) {
      setError("Error al eliminar el blog");
      console.error(err);
      return false;
    }
  };

  return { blogs, loading, error, createBlog, updateBlog, deleteBlog };
};

export default useEcologicalBlogs;
