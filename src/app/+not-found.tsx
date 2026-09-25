import { Redirect } from 'expo-router';

/** Unknown paths (e.g. the app served from a sub-path on the web) open the home screen. */
export default function NotFound() {
  return <Redirect href="/" />;
}
