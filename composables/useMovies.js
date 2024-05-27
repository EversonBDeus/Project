import { ref, onMounted } from 'vue';

const apiKey = 'd4de4034ccd9c788a224b01db7627f20';
const apiUrl = 'https://api.themoviedb.org/3/movie/popular';

export default function useMovies() {
  const movies = ref([]);

  onMounted(async () => {
    try {
      const response = await fetch(`${apiUrl}?api_key=${apiKey}`);
      const data = await response.json();
      movies.value = data.results;
      console.log('List of popular movies:', movies.value);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  });

  return { movies };
}
