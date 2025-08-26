import { WelcomeScreen } from '@/screens/WelcomeScreen'

export default function Index() {
  // Mock navigation props for web route
  const mockNavigation = {} as any
  const mockRoute = {} as any
  
  return <WelcomeScreen navigation={mockNavigation} route={mockRoute} />
}
