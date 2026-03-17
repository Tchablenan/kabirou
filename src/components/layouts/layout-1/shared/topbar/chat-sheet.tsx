"use client";

import { ReactNode, useState, useEffect, useRef } from 'react';
import {
  Calendar,
  CheckCheck,
  MoreVertical,
  Settings2,
  Shield,
  Upload,
  Users,
  Send,
} from 'lucide-react';
import Link from 'next/link';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { AvatarGroup } from '@/components/layouts/layout-1/shared/common/avatar-group';
import { useSession } from "next-auth/react";
import { useProfile } from "@/hooks/useProfile";

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'ai' | 'ADMIN';
  content: string;
  createdAt?: string | Date;
}

export interface VisitorInfo {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
}

interface ChatSheetProps {
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  messages: ChatMessage[];
  visitorInfo?: VisitorInfo;
  onSendMessage?: (content: string) => void;
  isLoading?: boolean;
  title?: string;
  isReadOnly?: boolean;
}

export function ChatSheet({ 
  trigger, 
  open, 
  onOpenChange, 
  messages, 
  visitorInfo, 
  onSendMessage, 
  isLoading,
  title = "Chat Support",
  isReadOnly = false
}: ChatSheetProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const { profile } = useProfile();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isReadOnly) return;
    onSendMessage?.(input);
    setInput('');
  };

  const userAvatar = session?.user?.image || toAbsoluteUrl('/media/avatars/300-2.png');
  const kabirouAvatar = profile?.image || toAbsoluteUrl('/media/avatars/300-1.png');
  const kabirouName = profile?.name || "Kabirou Djantchiemo";

  const content = (
    <SheetContent side="right" className="p-0 gap-0 sm:w-[500px] sm:max-w-none inset-5 start-auto h-auto rounded-lg [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5 flex flex-col shadow-2xl border border-border">
      <SheetHeader className="p-0">
        <div className="flex items-center justify-between p-4 border-b border-border bg-background">
          <SheetTitle className="text-sm font-bold ml-2">{title}</SheetTitle>
        </div>
        
        <div className="p-4 shadow-sm bg-accent/5 border-b border-border">
          <div className="flex items-center justify-between gap-2 px-2">
            <div className="flex items-center gap-3">
              <Avatar className="size-12 border-2 border-primary/20 bg-background flex items-center justify-center overflow-hidden">
                <AvatarImage src={kabirouAvatar} alt={kabirouName} />
                <AvatarFallback className="bg-primary/10 text-primary">KA</AvatarFallback>
                <AvatarIndicator className="-end-1 -bottom-1">
                  <AvatarStatus variant="online" className="size-3" />
                </AvatarIndicator>
              </Avatar>
              <div>
                <span className="text-sm font-bold text-foreground block">
                  {visitorInfo?.name || "Support Direct"}
                </span>
                <span className="text-xs italic text-muted-foreground block">
                  {isLoading ? "En train d'écrire..." : "Disponibilité active"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AvatarGroup
                size="size-8"
                group={[
                  { path: kabirouAvatar },
                  { fallback: 'V', variant: 'bg-blue-500 text-white font-bold' },
                ]}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" mode="icon" size="sm">
                    <MoreVertical className="size-4!" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-44" side="bottom" align="end">
                  <DropdownMenuItem asChild>
                    <Link href="#"><Users /> Invite Users</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Settings2 />
                      <span>Team Settings</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="w-44">
                        <DropdownMenuItem asChild>
                          <Link href="#"><Shield /> Find Members</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="#"><Calendar /> Meetings</Link>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </SheetHeader>

      <SheetBody 
        className="flex-1 overflow-y-auto p-6 space-y-5 bg-background scrollable-y-auto flex flex-col"
        ref={scrollRef as any}
      >
        {messages.map((m, index) => {
          const isUser = m.role === "user";
          const isAdmin = m.role === "ADMIN";
          
          if (isUser) {
            return (
              <div key={m.id || index} className="flex items-end justify-end gap-3 self-end w-full">
                <div className="flex flex-col gap-1 items-end max-w-[85%]">
                  <div className="bg-primary text-primary-foreground text-sm font-medium p-4 rounded-2xl rounded-tr-none shadow-sm">
                    {m.content}
                  </div>
                  <div className="flex items-center justify-end gap-1.5 px-1 mt-0.5">
                    <span className="text-[10px] text-muted-foreground font-bold tracking-tighter uppercase">
                      {m.createdAt ? new Date(m.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <CheckCheck size={14} className="text-green-500" />
                  </div>
                </div>
                <Avatar className="size-10 shrink-0 shadow-sm border border-border/10">
                  <AvatarImage src={userAvatar} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </div>
            );
          }

          if (isAdmin) {
            return (
              <div key={m.id || index} className="flex items-end justify-end gap-3 self-end w-full">
                <div className="flex flex-col gap-1 items-end max-w-[85%]">
                  <div className="bg-green-600 text-white text-sm font-medium p-4 rounded-2xl rounded-tr-none shadow-sm">
                    {m.content}
                  </div>
                  <div className="flex items-center justify-end gap-1.5 px-1 mt-0.5">
                    <span className="text-[10px] text-muted-foreground font-bold tracking-tighter uppercase">
                      {m.createdAt ? new Date(m.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase ml-2 tracking-widest">{kabirouName.split(' ')[0]}</span>
                  </div>
                </div>
                <Avatar className="size-10 shrink-0 shadow-sm border-2 border-green-500/20 bg-background flex items-center justify-center overflow-hidden">
                  <AvatarImage src={kabirouAvatar} />
                  <AvatarFallback className="bg-green-500 text-white">K</AvatarFallback>
                </Avatar>
              </div>
            );
          }

          return (
            <div key={m.id || index} className="flex items-end gap-3 self-start w-full pr-5">
              <Avatar className="size-10 shrink-0 shadow-sm border border-border/10 bg-background">
                <AvatarImage src={kabirouAvatar} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">KA</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1 max-w-[85%]">
                <div className="bg-accent/40 text-secondary-foreground text-sm font-medium p-4 rounded-2xl rounded-tl-none shadow-xs border border-border/5">
                  {m.content}
                </div>
                <span className="text-[10px] text-muted-foreground font-bold tracking-tighter uppercase px-1">
                  {m.createdAt ? new Date(m.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex items-end gap-3 self-start">
            <Avatar className="size-10 shrink-0 bg-background">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">KA</AvatarFallback>
              <AvatarImage src={kabirouAvatar} className="object-cover" />
            </Avatar>
            <div className="bg-accent/40 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center shadow-xs border border-border/5">
              <span className="size-1 bg-primary/40 rounded-full animate-bounce" />
              <span className="size-1 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="size-1 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </SheetBody>

      {!isReadOnly && (
        <SheetFooter className="block p-5 sm:space-x-0 mt-auto border-t border-border bg-background">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 shadow-inner border border-border/20">
                <AvatarImage src={userAvatar} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="w-full px-4 py-6 h-auto bg-accent/20 border-border/30 focus-visible:ring-primary/20 transition-all font-medium text-sm rounded-xl pr-12"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    mode="icon" 
                    type="button" 
                    className="size-10 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <AvatarGroup
                      size="size-5"
                      group={[{ path: toAbsoluteUrl('/media/svg/files/upload.svg') }]}
                    />
                  </Button>
                </div>
              </div>
              <Button 
                size="lg" 
                variant="mono" 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="h-12 px-6 font-bold text-sm rounded-xl flex items-center gap-2"
              >
                <Send className="size-4" />
                <span>Envoyer</span>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-1 opacity-30 mt-1">
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Chat Direct via Portfolio</span>
            </div>
          </form>
        </SheetFooter>
      )}
    </SheetContent>
  );

  if (trigger) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        {content}
      </Sheet>
    );
  }

  return content;
}
