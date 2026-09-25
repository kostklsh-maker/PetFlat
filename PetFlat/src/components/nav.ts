import { router } from 'expo-router';

/** Back when there is history, otherwise go home (e.g. screen opened via deep link). */
export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}
