<template>
<UTabs :items="items" class="w-full mb-5">
    <template #item="{ item }">
      <UCard   >
        <template #header>
          <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ item.label }}
          </p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ item.description }}
          </p>
        </template>
     
       
         
        <div v-if="item.key === 'login'" class="space-y-3 flex items-center p-8">
          <Login />
      </div>
        <div v-if="item.key === 'account'" class="space-y-3 flex items-center p-8">
        
          <Register />
      </div>

      </UCard>


    </template>
  </UTabs>


</template>

<script setup >

definePageMeta({
  middleware: 'auth',
});


</script>

<style >

</style>