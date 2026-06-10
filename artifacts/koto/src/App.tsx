import { Switch, Route, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { KanaPage } from './pages/KanaPage';
import { VocabularyPage } from './pages/VocabularyPage';
import { ListeningPage } from './pages/ListeningPage';
import { ExamsPage } from './pages/ExamsPage';
import { ExamDetailPage } from './pages/ExamDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/kana" component={KanaPage} />
        <Route path="/vocabulario" component={VocabularyPage} />
        <Route path="/escuta" component={ListeningPage} />
        <Route path="/simulados" component={ExamsPage} />
        <Route path="/simulados/:slug" component={ExamDetailPage} />
        <Route path="/progresso" component={DashboardPage} />
        <Route path="/sobre" component={AboutPage} />
        <Route path="/privacidade" component={PrivacyPage} />
        <Route path="/termos" component={TermsPage} />
        <Route path="/contato" component={ContactPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
