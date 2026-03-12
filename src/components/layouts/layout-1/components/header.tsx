"use client";

import { useEffect, useState } from 'react';
import {
  Bell,
  LayoutGrid,
  Menu,
  MessageCircleMore,
  SquareArrowOutUpRight,
} from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { AppsDropdownMenu } from '@/components/layouts/layout-1/shared/topbar/apps-dropdown-menu';
import { ChatSheet } from '@/components/layouts/layout-1/shared/topbar/chat-sheet';
import { NotificationsSheet } from '@/components/layouts/layout-1/shared/topbar/notifications-sheet';
import { UserDropdownMenu } from '@/components/layouts/layout-1/shared/topbar/user-dropdown-menu';
import { SidebarMenu } from './sidebar-menu';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export function Header() {
  const { data: session } = useSession();
  const [isSidebarSheetOpen, setIsSidebarSheetOpen] = useState(false);

  const pathname = usePathname();
  const mobileMode = useIsMobile();

  const scrollPosition = useScrollPosition();
  const headerSticky: boolean = scrollPosition > 0;

  // Close sheet when route changes
  useEffect(() => {
    setIsSidebarSheetOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'header fixed top-0 z-10 start-0 flex items-stretch shrink-0 border-b border-transparent bg-background end-0 pe-[var(--removed-body-scroll-bar-size,0px)]',
        headerSticky && 'border-b border-border',
      )}
    >
      <div className="container-fluid flex justify-between items-stretch lg:gap-4">
        {/* HeaderLogo (For Mobile) */}
        <div className="flex lg:hidden items-center gap-2.5">
          <Link href="/" className="shrink-0">
            <img
              src={toAbsoluteUrl('/media/app/mini-logo.svg')}
              className="h-[25px] w-full"
              alt="mini-logo"
            />
          </Link>
          <div className="flex items-center">
            {mobileMode && (
              <Sheet
                open={isSidebarSheetOpen}
                onOpenChange={setIsSidebarSheetOpen}
              >
                <SheetTrigger asChild>
                  <Button variant="ghost" mode="icon">
                    <Menu className="text-muted-foreground/70" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  className="p-0 gap-0 w-[275px]"
                  side="left"
                  close={false}
                >
                  <SheetHeader className="p-0 space-y-0" />
                  <SheetBody className="p-0 overflow-y-auto">
                    <SidebarMenu />
                  </SheetBody>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>

        {/* Empty space where MegaMenu used to be, to push topbar to right */}
        <div className="hidden lg:flex items-center grow">
          {/* We can put a Page Title or Breadcrumb here in the future if needed */}
        </div>

        {/* HeaderTopbar */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="hidden sm:flex items-center gap-2"
            asChild
          >
            <Link href="/" target="_blank">
              <SquareArrowOutUpRight className="size-4" />
              <span>Voir le site</span>
            </Link>
          </Button>

          <NotificationsSheet
            trigger={
              <Button
                variant="ghost"
                mode="icon"
                shape="circle"
                className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
              >
                <Bell className="size-4.5!" />
              </Button>
            }
          />
          
          <ChatSheet
            trigger={
              <Button
                variant="ghost"
                mode="icon"
                shape="circle"
                className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
              >
                <MessageCircleMore className="size-4.5!" />
              </Button>
            }
          />

          <AppsDropdownMenu
            trigger={
              <Button
                variant="ghost"
                mode="icon"
                shape="circle"
                className="size-9 hover:bg-primary/10 hover:[&_svg]:text-primary"
              >
                <LayoutGrid className="size-4.5!" />
              </Button>
            }
          />

          <UserDropdownMenu
            trigger={
              session?.user?.image ? (
                <img
                  className="size-9 rounded-full border-2 border-green-500 shrink-0 cursor-pointer object-cover"
                  src={session.user.image}
                  alt="User Avatar"
                />
              ) : (
                <div className="size-9 rounded-full bg-primary flex items-center justify-center text-white font-bold border-2 border-green-500 shrink-0 cursor-pointer">
                  {session?.user?.name?.[0] || 'A'}
                </div>
              )
            }
          />
        </div>
      </div>
    </header>
  );
}
