<template>
          <div class="w-full flex flex-col gap-y-4">
    <UCard  :ui="{ body: { base: 'grid grid-cols-3' } }">
      <div class="space-y-4">
        <form @submit.prevent="userLogin">
        <UFormGroup label="Email" name="email" :required="true">
          <UInput v-model="email" required="true" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput  v-model="password"  type="password" required />
        </UFormGroup>

        <UButton type="submit" label="Login" color="gray" block  :loading="loading" :disabled="loading"/>

        <span class="bg-opacity-50 absolute right-8 top-8 rounded-lg bg-[#242424] p-8 px-4 py-2 text-red-500" v-if="errorMsg">
          {{ errorMsg }}
        </span>
        <p class="mt-3 text-xs">You don't have an account yet?</p>
        <nuxt-link class="w-fit text-sm text-[#aac8e4] hover:text-[#42b883]" to="/register"
          >Register</nuxt-link>
      </form>

      </div>

      <UDivider label="OR" orientation="vertical" />

      <div class="space-y-4 flex flex-col justify-center">
        <UButton color="black" label="Login with Facebook" icon="i-simple-icons-github" block @click="loginWithFacebook" />
 
      </div>
    </UCard>
  </div>
       
</template>

<script setup>


const loading = ref(false)

const user = useSupabaseUser();
const email = ref('');
const password = ref('');
const errorMsg = ref('');
const { auth } = useSupabaseClient();



const userLogin = async () => {
  try {
    const { error } = await auth.signInWithPassword({
      email: email.value,
      password: password.value,
      options:{
        emailRedirectTo:'http://localhost:3000/'
      }
  
    });

    email.value = '';
    password.value = '';

    if (error) throw error;
  } catch (error) {
    errorMsg.value = error.message;
    setTimeout(() => {
      errorMsg.value = '';
    }, 3000);
  }
};

// Função para login com Facebook

const loginWithFacebook = async () => {
  try {
    const { data, error } = await auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: 'https://project-rori.vercel.app/confirm'
      },
      
    });

    if (error) {
      console.error('Erro ao fazer login com o Facebook:', error.message);
    } else if (data) {
   
      
      console.log('Login foi bem-sucedido:', data.user);
    
   
    }
  } catch (error) {
    console.error('Erro ao fazer login com o Facebook:', error.message);
  }
};

watchEffect(() => {
  if (user.value) {
    return navigateTo('/');
  }
});
</script>

<style lang="scss" scoped>

</style>