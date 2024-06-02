<template>
  <header class="flex justify-between items-center mt-10">
   <NuxtLink to="/" class="text-xl font-bold">
     Cine Connection
   </NuxtLink>
   

   <div>
    <UButton label="Conta de Usuario" @click="isOpen = true" />

    <USlideover v-model="isOpen">
      <UCard class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        
       
  <UAvatar class="mr-5" src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Avatar" />
  <UButton
     icon="i-heroicons-pencil-square"
     size="sm"
     color="primary"
     variant="solid"
     label="Sair"
     @click="userLogout"
     :trailing="false"
   />
     <template #panel>
       <div class="p-4 ">
         <Placeholder class="h-20 w-48 " />

       </div>
     </template>

   <h3 class="text-2xl font-bold text-[#aac8e4]">Email</h3>
          <p class="text-base text-gray-400">{{ user.email }}</p>

          <UButton
    icon="i-heroicons-pencil-square"
    size="sm"
    color="primary"
    variant="solid"
    label="Adicionar um perfil"
    :trailing="false"
    class="mb-5"
  />

  <UContainer   class="mb-5">
  
    <form @submit.prevent="createProfile">
      <UFormGroup   class="mb-5" label="Nome " name="nome" >
          <UInput v-model="profilename" required />
        </UFormGroup>
        <UFormGroup  v-if="profiles.length === 0" class="mb-5" label="Pin " name="Pin" >
          <UInput type="password" v-model="userpin" required />
        </UFormGroup>
       
        <UButton type="submit" label="Criar" color="gray" block  :loading="loading" :disabled="loading"/>
    </form>
  </UContainer>
          
   <UDivider label="Perfils" size="sm"   class="mb-10" />

  
 
    <div v-if="profiles.length > 0" class=" flex flex-wrap  space-x-4 space-y-4">
      <div v-for="profile in profiles" :key="profile.id">
        <UButton
          icon="i-heroicons-user"
          size="xl"
          color="primary"
          variant="solid"
          :label="profile.profilename"
         
          :trailing="false"
         
        />
      </div>
  

    </div>

  

   
      </UCard>
    </USlideover>
  </div>


   


 </header>

</template>

<script setup>
const { auth } = useSupabaseClient();
const user = useSupabaseUser();
const supabase = useSupabaseClient()
const profilename = ref('');
const userpin = ref('');
const isOpen = ref(false)
const loading = ref(false);
const profiles = ref([]);


const userLogout = async () => {
  await auth.signOut();
  navigateTo('/login')

};


const createProfile = async () => {
  try {
    // Consulta o número de perfis existentes
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(4);

    if (profilesError) {
      throw profilesError;
    }

    // Se já houver 4 perfis, exibe uma mensagem de erro
    if (profiles.length >= 4) {
      throw new Error('Já existem 4 perfis. Você não pode adicionar mais perfis.');
    }

    loading.value = true;
    
    // Insere o novo perfil
    const { error: insertError } = await supabase.from('profiles').insert({
      profilename: profilename.value,
      userpin: userpin.value // Adiciona o valor do input à coluna 'profilename'
    });

    if (insertError) {
      throw insertError;
    } else {
      console.log('Perfil criado com sucesso!');
      window.location.reload(); // Recarrega a página
    }
  } catch (error) {
    console.error('Erro ao criar o perfil:', error.message);
  } finally {
    loading.value = false;
    isOpenProfileForm.value = false; // Fecha o formulário após a submissão

  }
};

// Função para buscar os perfis
const fetchProfiles = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('id, profilename');
    if (error) {
      throw error;
    }
    profiles.value = data;
  } catch (error) {
    console.error('Erro ao buscar os perfis:', error.message);
  }
};



onMounted(fetchProfiles);
</script>

<style >

</style>
