<template>
    <div>
        <UCard>
            <template>
                Entrando...
            </template>
            Aguarde um momento ...
        </UCard>

    </div>
</template>

<script setup>
   setTimeout(() => {
    useRedirectIfAuthenticated()
       
    }, 1000);
    


</script>

<style >

</style>