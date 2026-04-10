import { redirect } from 'next/navigation';

/** Ruta antigua: redirige a Mis gastos */
export default function MisGatosRedirectPage() {
  redirect('/mis-gastos');
}
