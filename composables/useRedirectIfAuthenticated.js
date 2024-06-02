export const useRedirectIfAuthenticated = (url = '/') =>{
    const user = useSupabaseUser()
    watch(user,(user) =>{
      if(user){
        return navigateTo(url)
         // Recarrega a página quando o usuário está autenticado
      }
    },{
      immediate:true
    })
    return {user}
    } 
 
    