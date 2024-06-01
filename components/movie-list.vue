<template>
  <UCard>
    <template #header>
      <Placeholder class="h-8" />
      <h1 class="mt-10 mb-5">Lista de Filmes</h1>
    </template>

    <Placeholder class="h-32" />
    <UInput class="mb-5" 
    v-model="searchQuery"/>

    <hr />

    <!-------------Filmes --------------->
    <div class="container">
      <div
        v-for="(movie, index) in filteredMovies"
        :key="index"
        class="container__filmes"
      >
        <div class="movie-image-container">
          <img
            :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
            :alt="movie.title"
            class="movie-image"
          />
        </div>
        <div>
          <!-------------Filmes conteudo--------------->
          <h2 class="text-lg font-bold mb-4">{{ movie.title }}</h2>
          <p class="mb-4 text-xs">{{ movie.overview }}</p>
          <div class="flex space-x-4 mb-8">
            <!------------- favorito--------------->
            <UButton
              icon="i-heroicons-pencil-square"
              size="2xs"
              color="primary"
              variant="solid"
              label="Favorite"
              :trailing="false"
              @click="handleFavorite(movie.id, 'favoritemovie')"
            />
            <!------------- Assistir--------------->
            <UButton
              icon="i-heroicons-pencil-square"
              size="2xs"
              color="primary"
              variant="solid"
              label="watchlist"
              :trailing="false"
              @click="handleFavorite(movie.id, 'watchlist')"
            />
          </div>
          <!------------- Genero--------------->
          <div>
            <UBadge
              v-for="(genre_id, genreIndex) in movie.genre_ids"
              :key="genreIndex"
              class="mr-5"
              color="black"
              variant="solid"
              >{{ genres[genre_id] }}</UBadge
            >
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup>
const props = defineProps({
  profileId: Object,
});

watch(
  () => props.profileId,
  async (newValue) => {

  }
);
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const apiKey = "d4de4034ccd9c788a224b01db7627f20";
const apiUrl = "https://api.themoviedb.org/3/movie/popular";
const movies = ref([]);
const searchQuery = ref('');
console.log(user);
onMounted(async () => {
  try {
    const response = await fetch(`${apiUrl}?api_key=${apiKey}`);
    const data = await response.json();
    movies.value = data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
});
const filteredMovies = computed(() => {
  // Verifica se há uma consulta de pesquisa
  if (searchQuery.value.length === 0) {
    // Se não houver consulta, retorna todos os filmes
    return movies.value;
  } else {
 // Converte a consulta de pesquisa para minúsculas


 const lowercaseQuery = searchQuery.value.toLowerCase();
  return movies.value.filter(movie =>
    movie.title.toLowerCase().includes(lowercaseQuery)
  );

  
  }
  
});


// Método para lidar com o clique no botão de favorito
const handleFavorite = async (movieId, listType) => {
  const profileId = props.profileId.id;
  console.log("1");
  try {
    // Verifica se o profileId é válido
    if (!profileId) {
      console.error("profileId inválido:", profileId);
      return;
    }

    // Verifica se o movieId é válido
    if (!movieId) {
      console.error("movieId inválido:", movieId);
      return;
    }

    // Procura na tabela 'profiles' pelo registro correspondente ao 'profileId'
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select(listType) // Alterado para selecionar a lista correta com base no tipo
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

    // Extrai a lista correspondente do perfil
    const list = profileData[listType] || [];

    // Adiciona o movieId à lista, se ainda não estiver presente
    if (!list.includes(movieId)) {
      list.push(movieId);
    } else {
      console.log("Filme já está na lista:", movieId);
      return;
    }


  

    // Cria uma cópia do objeto genreswatched existente
    const existingGenresWatched = profileData.genreswatched || {};

 // Obter os gêneros do filme
 const movieGenres = movies.value.find(movie => movie.id === movieId)?.genre_ids || [];

// Mescla os gêneros assistidos existentes com os novos gêneros
const genreswatched = { ...profileData.genreswatched }; // Faz uma cópia dos gêneros assistidos existentes
movieGenres.forEach(genreId => {
  const genreName = genres[genreId];
  genreswatched[genreName] = (genreswatched[genreName] || 0) + 1; // Incrementa o contador
});
    console.log("Genreswatched antes de atualizar:", genreswatched);

    // Atualiza a tabela 'profiles' com as listas atualizadas
    const updateObject = {
      [listType]: list, // Define a propriedade de atualização com base no tipo de lista
      genreswatched: genreswatched // Atualiza 'genreswatched'
    };

    const { data: updatedProfileData, error: updateError } = await supabase
      .from("profiles")
      .update(updateObject) // Atualiza as propriedades correspondentes
      .eq("id", profileId);

    if (updateError) {
      throw updateError;
    }

    console.log("Filme adicionado à lista e genreswatched atualizado:", movieId, listType, genreswatched);
  } catch (error) {
    console.error("Erro ao adicionar o filme à lista:", error.message);
  }
};


const genres = {
  12: "Adventure",
  14: "Fantasy",
  16: "Animation",
  18: "Drama",
  27: "Horror",
  28: "Action",
  35: "Comedy",
  36: "History",
  37: "Western",
  53: "Thriller",
  80: "Crime",
  99: "Documentary",
  9648: "Mystery",
  10402: "Music",
  10749: "Romance",
  10751: "Family",
  10752: "War",
  10770: "TV Movie",
};
</script>

<style>
.container__filmes {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(200px, 1fr)
  ); /* Two columns with minimum width of 200px */
  gap: 1rem; /* Gap between grid items */
}

/* Estilos opcionais */
.movie-image-container {
  width: 200px !important;
  height: 300px !important;

  border: 1px solid black;
}

.movie-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}
</style>
