<template>
  <h3 class="mb-2">Vendo como:</h3>
  <USelectMenu
    class="mb-5"
    v-model="selected"
    :options="people"
    placeholder="Select people"
    value-attribute="id"
    option-attribute="name"
  />
  <div>
    <UButton class="mr-5" @click="isOpenFavorite = !isOpenFavorite">Favorite</UButton>
    <UButton class="mr-5" @click="isOpenWatchlist = !isOpenWatchlist">Watch Lis</UButton>
    <UButton class="mr-5" @click="isOpenWatched = !isOpenWatched">Watechd</UButton>
  </div>

  <UContainer v-if="isOpenFavorite" class="mb-10">
    <Placeholder class="h-32" />
    <div>
      <h1>Favoritos</h1>
      <div v-for="movie in favoriteMoviesDetails" :key="movie.id">
        <div>
          <!-------------Filmes conteudo--------------->
          <h2 class="text-lg font-bold mb-4">{{ movie.title }}</h2>
          <p class="mb-4 text-xs">{{ movie.overview }}</p>
          <div class="flex space-x-4 mb-8"></div>
          <div class="movie-image-container">
            <img
              class="movie-image"
              :src="'https://image.tmdb.org/t/p/w500/' + movie.poster_path"
              :alt="movie.title"
            />
          </div>
        </div>
      </div>
    </div>
  </UContainer>

  <UContainer v-if="isOpenWatchlist" class="mb-10">
    <Placeholder class="h-32" />
    <div>
      <h1>Watch List</h1>
      <div v-for="movie in watchlistMoviesDetail" :key="movie.id">
        <div>
          <!-------------Filmes conteudo--------------->
          <h2 class="text-lg font-bold mb-4">{{ movie.title }}</h2>
          <p class="mb-4 text-xs">{{ movie.overview }}</p>
          <div class="flex space-x-4 mb-8"></div>
          <div class="movie-image-container">
            <img
              class="movie-image"
              :src="'https://image.tmdb.org/t/p/w500/' + movie.poster_path"
              :alt="movie.title"
            />
          </div>
          <UButton @click="addToWatched(movie.id)">Wateched</UButton>
        </div>
      </div>
    </div>
  </UContainer>

  <UContainer v-if="isOpenWatched" class="mb-10">
    <Placeholder class="h-32" />
    <div>
      <h1>Watched</h1>
      <div v-for="movie in watchedMoviesDetails" :key="movie.id">
        <div>
          <!-------------Filmes conteudo--------------->
          <h2 class="text-lg font-bold mb-4">{{ movie.title }}</h2>
          <p class="mb-4 text-xs">{{ movie.overview }}</p>
          <div class="flex space-x-4 mb-8"></div>
          <div class="movie-image-container">
            <img
              class="movie-image"
              :src="'https://image.tmdb.org/t/p/w500/' + movie.poster_path"
              :alt="movie.title"
            />
          </div>
        </div>
      </div>
    </div>
  </UContainer>

  <Login />

  <section>
    <MovieList :profileId="selectedProfile" />
  </section>
</template>

<script setup>
const supabase = useSupabaseClient();
const selectedProfile = ref(null);
const profileId = selectedProfile.id;
const apiKey = "d4de4034ccd9c788a224b01db7627f20";
const apiUrl = "https://api.themoviedb.org/3/movie/popular";
const movies = ref([]);
const selectedMovie = ref(null);
const isOpenWatched = ref(false);
const isOpenFavorite = ref(false);
const isOpenWatchlist = ref(false);
const favoriteMoviesDetails = ref([]);
const watchlistMoviesDetail = ref([]);
const watchedMoviesDetails = ref([]);
const profileIds = ref([]);
const profileNames = ref([]);
const people = ref([]);
const favoriteMovies = ref([]);
const watchlistMovies = ref([]);
const watchedMovies = ref([]);
const selected = ref(null);

const addToWatched = async (movieId) => {
  const profileId = selectedProfile.value.id;
  try {
    // Verifica se o movieId e o profileId são válidos
    if (!movieId || !profileId) {
      console.error("movieId ou profileId inválidos:", movieId, profileId);
      return;
    }

    // Procura na tabela 'profiles' pelo registro correspondente ao 'profileId'
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("watched")
      .eq("id", profileId)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Verifica se encontrou o perfil correspondente
    if (!profileData) {
      console.error("Perfil não encontrado:", profileId);
      return;
    }

    // Extrai a lista de watched do perfil
    const watched = profileData.watched || [];

    // Adiciona o movieId à lista, se ainda não estiver presente
    if (!watched.includes(movieId)) {
     
      watched.push(movieId);

      // Atualiza a tabela 'profiles' com a lista atualizada
      const { data: updatedProfileData, error: updateError } = await supabase
        .from("profiles")
        .update({ watched })
        .eq("id", profileId);

      if (updateError) {
        throw updateError;
      }

      console.log("Filme adicionado à lista watched:", movieId);
    } else {
      console.log("Filme já está na lista watched:", movieId);
    }
  } catch (error) {
    console.error("Erro ao adicionar o filme à lista watched:", error.message);
  }
};



watch(selected, (newValue) => {
  // Encontre o perfil selecionado com base no ID
  selectedProfile.value = people.value.find(
    (profile) => profile.id === newValue
  );
  if (selectedProfile.value) {
    fetchMoviesFromProfile(); // Chama a função apenas se o perfil selecionado for válido
  }
});

const fetchProfiles = async () => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, profilename");
    if (error) {
      throw error;
    }

    // Limpa os arrays de IDs e nomes
    profileIds.value = [];
    profileNames.value = [];

    // Preenche os arrays de IDs e nomes com os dados obtidos
    data.forEach((profile) => {
      profileIds.value.push(profile.id);
      profileNames.value.push(profile.profilename);
    });

    // Combina os arrays de IDs e nomes para formar o array 'people'
    people.value = profileIds.value.map((id, index) => ({
      id,
      name: profileNames.value[index],
    }));

  

    // Defina o primeiro perfil como selecionado após recuperar os perfis
    if (people.value.length > 0) {
      selected.value = people.value[0].id;
    }
  } catch (error) {
    console.error("Erro ao buscar os perfis:", error.message);
  }
};
const fetchMoviesFromProfile = async () => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, favoritemovie, watchlist, watched")
      .eq("id", selectedProfile.value.id);

    if (error) {
      throw error;
    }
    if (data && data.length > 0) {
      const profileData = data[0];

      // Armazenar os filmes favoritos, watchlist e watched em variáveis separadas
      favoriteMovies.value = profileData.favoritemovie || [];
      watchlistMovies.value = profileData.watchlist || [];
      watchedMovies.value = profileData.watched || [];

      // Obter detalhes completos dos filmes favoritos com base nos IDs retornados
      favoriteMoviesDetails.value = getMoviesByIds(profileData.favoritemovie);

      // Obter detalhes completos dos filmes da watchlist com base nos IDs retornados
      watchlistMoviesDetail.value = getMoviesByIds(profileData.watchlist);

      // Obter detalhes completos dos filmes assistidos com base nos IDs retornados
      watchedMoviesDetails.value = getMoviesByIds(profileData.watched);
    } else {
      console.warn("Perfil não encontrado");
    }
  } catch (error) {
    console.error("Erro ao buscar filmes do perfil:", error.message);
  }
};

// Função auxiliar para obter detalhes dos filmes por IDs
const getMoviesByIds = (movieIds) => {
  if (movieIds && Array.isArray(movieIds)) {
    return movieIds.map((movieId) => getMovieById(movieId));
  } else {
    return [];
  }
};

// Função auxiliar para obter detalhes do filme por ID
const getMovieById = (movieId) => {
  const movie = movies.value.find((movie) => movie.id === movieId);
  return movie;
};
onMounted(async () => {
  fetchMoviesFromProfile();
  try {
    const response = await fetch(`${apiUrl}?api_key=${apiKey}`);
    const data = await response.json();
    movies.value = data.results;
    console.log("List of popular movies:", movies.value);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
});
onMounted(fetchProfiles);
</script>

<style>
/* Estilos opcionais */
</style>
