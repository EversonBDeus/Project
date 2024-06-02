// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/supabase"],
  supabase:{
    redirect:false,
    redirectOptions: {
      login: '/login',
      callback: 'http://localhost:3000/',
      include: undefined,
      exclude: ['/register'],
      cookieRedirect: false,
    },
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },
  
})