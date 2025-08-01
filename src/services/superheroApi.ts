import { Superhero } from "@/types/superhero";


const BASE_URL = '/api/superhero';

class SuperheroApiService {
  private async fetchFromApi<T>(path: string): Promise<T | null> {
    try {
      const response = await fetch(`${BASE_URL}${path}`);
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();

      if (data.response === "error") {
        console.error("API Error:", data.error);
        return null;
      }

      return data as T;
    } catch (error) {
      console.error("Get superhero error:", error);
      return null;
    }
  }

  async getSuperheroById(id: string): Promise<Superhero | null> {
    return this.fetchFromApi<Superhero>(`/${id}`);
  }

  async searchSuperheroes(query: string): Promise<Superhero[] | null> {
    const data = await this.fetchFromApi<{ response: string; results: Superhero[] }>(`/search/${query}`);
    return data?.results || null;
  }

  async getSuperheroesByIds(ids: string[]): Promise<Superhero[] | null> {
    try {
      const heroPromises = ids.map(id => this.getSuperheroById(id));
      const heroes = await Promise.all(heroPromises);
      return heroes.filter(hero => hero !== null) as Superhero[];
    } catch (error) {
      console.error("Error fetching multiple superheroes:", error);
      return null;
    }
  }

  async getInitialSuperheroes(): Promise<Superhero[] | null> {
    const initialIds = Array.from({ length: 20 }, (_, i) => String(i + 1));
    const heroPromises = initialIds.map(id => this.getSuperheroById(id));
    const heroes = await Promise.all(heroPromises);
    return heroes.filter(hero => hero !== null) as Superhero[];
  }
}

export const superheroApiService = new SuperheroApiService();
