import { Switch, Route, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { KanaHubPage } from './pages/KanaHubPage';
import { KanaLearnPage } from './pages/KanaLearnPage';
import { KanaTrainPage } from './pages/KanaTrainPage';
import { KanaReviewPage } from './pages/KanaReviewPage';
import { KanaStatsPage } from './pages/KanaStatsPage';
import { KanaSettingsPage } from './pages/KanaSettingsPage';
import { VocabularyPage } from './pages/VocabularyPage';
import { VocabularyLibraryPage } from './pages/VocabularyLibraryPage';
import { AulasExtrasPage } from './pages/AulasExtrasPage';
import { ExamsPage } from './pages/ExamsPage';
import { ExamDetailPage } from './pages/ExamDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { SettingsPage } from './pages/SettingsPage';
import NotFound from '@/pages/not-found';
import { useEffect } from 'react';
import { applyTheme } from './services/settings/settings.local';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Rotas full-screen, sem o shell do app */}
      <Route path="/entrar" component={LoginPage} />

      {/* Demais rotas dentro do layout padrão */}
      <Route>
        <AppShellRoutes />
      </Route>
    </Switch>
  );
}

function AppShellRoutes() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/kana" component={KanaHubPage} />
        <Route path="/kana/aprender" component={KanaLearnPage} />
        <Route path="/kana/treinar" component={KanaTrainPage} />
        <Route path="/kana/revisar" component={KanaReviewPage} />
        <Route path="/kana/estatisticas" component={KanaStatsPage} />
        <Route path="/kana/configurar" component={KanaSettingsPage} />
        <Route path="/aulas" component={AulasExtrasPage} />
        <Route path="/vocabulario" component={VocabularyLibraryPage} />
        <Route path="/vocabulario/treinar" component={VocabularyPage} />
        <Route path="/simulados" component={ExamsPage} />
        <Route path="/simulados/:slug" component={ExamDetailPage} />
        <Route path="/progresso" component={DashboardPage} />
        <Route path="/configuracoes" component={SettingsPage} />
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
  useEffect(() => {
    applyTheme();
  }, []);

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
