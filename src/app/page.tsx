import { redirect } from 'next/navigation';

// Fallback for hosts that ignore next.config redirects.
export default function Home() {
  redirect('https://baobun.dev');
}
