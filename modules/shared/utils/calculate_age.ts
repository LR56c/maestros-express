export const calculateAge = ( date: Date ): number =>{
  const hoy = new Date()

  let edad  = hoy.getFullYear() - date.getFullYear()
  const mes = hoy.getMonth() - date.getMonth()

  if ( mes < 0 || (
    mes === 0 && hoy.getDate() < date.getDate()
  ) )
  {
    edad--
  }

  return edad
}
