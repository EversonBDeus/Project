// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/supabase"],
  supabase:{
    redirect:true,
    redirectOptions: {
      login: '/login',
      callback: '/conirm',
      include: undefined,
      exclude: ['/register'],
      cookieRedirect: false,
    },
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },
  
})