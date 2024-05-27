<template>


        
          <div class="w-full flex flex-col gap-y-4">
    <UCard v-if="!success" :ui="{ body: { base: 'grid grid-cols-3' } }">
      <div class="space-y-4">
        <form @submit.prevent="userRegister">
        <UFormGroup label="Name" name="name">
          <UInput v-model="name" type="string" required />
        </UFormGroup>

        <UFormGroup label="Email" name="email" :required="true" help="Você receberá um link de confirmação">
          <UInput v-model="email" type="email" required />
        </UFormGroup>
        <UFormGroup label="Date of birth" name="Date of birth">
          <UInput v-model="date" type="date" required />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput  v-model="password" type="password" required/>
        </UFormGroup>

        <UFormGroup label="Confirm Password" name="confirmpassword">
          <UInput  v-model="confirmPassword" type="password" required/>
        </UFormGroup>
      
        <UButton type="submit" label="Register" color="gray" block  :loading="loading" :disabled="loading"/>
      </form>
      </div>

      <UDivider label="OR" orientation="vertical" />

      <div class="space-y-4 flex flex-col justify-center">
        <UButton color="black" label="Register with Facebook" icon="i-simple-icons-github" block />
 
      </div>
    </UCard>
    <UCard v-else>
  <template #header>
    O e-mail foi enviado
  </template>
  <div class="text-center">
    <p class="mb-4">Enviamos um e-mail para <strong>{{email}}</strong> com um link para assinar</p>
    <p><strong>Importante:</strong> O link expirará em 5 minutos.</p>
  </div>
</UCard>
  </div>
    

   







</template>

<script setup>
useHead({
  title: 'Login | supaAuth'
})
const user = useSupabaseUser()
const loading = ref(false)
const errorMsg = ref('');
const email = ref('')
const password = ref('')
const confirmPassword = ref('');
const name = ref('')
const date = ref('')

const { auth } = useSupabaseClient();

const userRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Passwords do not match!';
    password.value = '';
    confirmPassword.value = '';
    setTimeout(() => {
      errorMsg.value = '';
    }, 3000);
    return;
  }
  try {
    loading.value = true
    const { error } = await auth.signUp({
        name:name.value,
        date:date.value,
      email: email.value,
      password: password.value,
    });
    name.value='';
    date.value='';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
    loading.value = false

    if (error) throw error;
} catch (error) {
    errorMsg.value = error.message;
    setTimeout(() => {
      errorMsg.value = '';
    }, 3000);
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