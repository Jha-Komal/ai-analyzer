import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { ServerIcon, InfoIcon } from 'lucide-react';

export function SettingsPage() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">Platform configuration and information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ServerIcon className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">API Configuration</CardTitle>
          </div>
          <CardDescription>
            Backend connection settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground mb-1 font-medium">API Base URL</p>
            <p className="text-sm font-mono text-foreground">{apiUrl}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            To change the API URL, set the <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">VITE_API_URL</code> environment variable in your{' '}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">.env</code> file.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <InfoIcon className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Platform Info</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Version</span>
            <Badge variant="secondary">v0.1.0</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Framework</span>
            <span className="text-sm text-foreground">React 18 + Vite</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">UI Library</span>
            <span className="text-sm text-foreground">shadcn/ui + Tailwind CSS</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Data Fetching</span>
            <span className="text-sm text-foreground">TanStack Query v5</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Charts</span>
            <span className="text-sm text-foreground">Recharts</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Future Settings</CardTitle>
          <CardDescription>Planned configuration options</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              Theme customization
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              Notification preferences
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              Data export options
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              User account management
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
