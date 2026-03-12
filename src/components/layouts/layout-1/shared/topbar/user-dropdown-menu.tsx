import { ReactNode } from 'react';
import {
  LogOut,
  LayoutGrid,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession, signOut } from 'next-auth/react';

export function UserDropdownMenu({ trigger }: { trigger: ReactNode }) {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" side="bottom" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            {session?.user?.image ? (
              <img
                className="size-9 rounded-full border-2 border-green-500 shrink-0 object-cover"
                src={session.user.image}
                alt="User Avatar"
              />
            ) : (
              <div className="size-9 rounded-full bg-primary flex items-center justify-center text-white font-bold border-2 border-green-500 shadow-sm">
                {session?.user?.name?.[0] || 'A'}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm text-mono font-semibold">
                {session?.user?.name || 'Admin'}
              </span>
              <span className="text-xs text-muted-foreground">
                {session?.user?.email || 'admin@kbi.com'}
              </span>
            </div>
          </div>
          <Badge variant="primary" appearance="light" size="sm">
            Admin
          </Badge>
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem asChild>
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2"
          >
            <LayoutGrid className="size-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/admin/profile"
            className="flex items-center gap-2"
          >
            <User className="size-4" />
            Mon Profil
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Footer */}
        <DropdownMenuItem
          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          onSelect={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="size-4" />
          <div className="flex items-center gap-2 justify-between grow">
            Se déconnecter
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
