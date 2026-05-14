"use client";

import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useState, useRef } from 'react';
import { UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  CheckCheck,
  X,
} from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useProfile } from "@/hooks/useProfile";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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

export default function Chat() {
  const { data: session } = useSession();
  const { profile } = useProfile();
  const [mounted, setMounted] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    let id = sessionStorage.getItem("chat_conversation_id");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("chat_conversation_id", id);
    }
    setConversationId(id);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('chat-open');
    } else {
      document.body.classList.remove('chat-open');
    }
    return () => document.body.classList.remove('chat-open');
  }, [isOpen]);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { conversationId },
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!conversationId) return;

    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/chat/history?conversationId=${conversationId}`);
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else if (messages.length === 0) {
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              parts: [
                {
                  type: "text",
                  text: `Bonjour ! Je suis ${profile?.name?.split(' ')[0] || "Kabirou"}. Je suis actuellement en ligne ou occupé par mes projets, mais vous pouvez me laisser un message ici et je vous répondrai directement. Comment puis-je vous aider ?`,
                },
              ],
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };

    fetchHistory();

    const interval = setInterval(() => {
      if (!isLoading && isOpen) {
        fetchHistory();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [conversationId, setMessages, isLoading, isOpen, profile?.name]);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: input }],
    });
    setInput("");
  };

  if (!mounted) {
    return null;
  }

  const userAvatar = session?.user?.image || toAbsoluteUrl('/media/avatars/300-2.png');
  const kabirouAvatar = profile?.image || toAbsoluteUrl('/media/avatars/300-1.png');
  const kabirouName = profile?.name || "Kabirou Djantchiemo";

  return (
    <div className="fixed bottom-[90px] right-[20px] z-[99999] pointer-events-auto">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            style={{
              backgroundColor: '#FF014F',
              width: '55px',
              height: '55px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.25), 0 4px 6px -2px rgba(255, 1, 79, 0.2)',
              cursor: 'pointer',
              border: 'none',
              padding: 0,
              margin: 0,
              transition: 'transform 0.3s ease, opacity 0.3s ease',
              opacity: isOpen ? 0 : 1,
              pointerEvents: isOpen ? 'none' : 'auto',
            }}
            className="hover:scale-110 active:scale-95"
            aria-label="Ouvrir le chat"
          >
            <i className="fab fa-facebook-messenger" style={{ fontSize: '22px', color: '#fff' }} />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="p-0 gap-0 sm:w-[500px] sm:max-w-none inset-5 start-auto h-auto rounded-lg [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5 flex flex-col shadow-2xl border border-border">
          <SheetHeader className="p-0">
            <div className="flex items-center justify-between p-4 border-b border-border bg-background">
              <SheetTitle className="text-sm font-bold ml-2">Chat Direct</SheetTitle>
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
                      {kabirouName}
                    </span>
                    <span className="text-xs italic text-muted-foreground block">
                      {isLoading ? "En train de répondre..." : "Disponibilité active"}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  mode="icon"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  aria-label="Fermer le chat"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>

          <SheetBody
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-background scrollable-y-auto flex flex-col"
            ref={scrollRef as any}
          >
            {messages.map((m: any, index) => {
              const isUser = m.role === "user";
              const isAdmin = m.role === "ADMIN";
              
              if (isUser) {
                return (
                  <div key={m.id || index} className="flex items-end justify-end gap-3 self-end w-full">
                    <div className="flex flex-col gap-1.5 items-end max-w-[75%]">
                      <div className="bg-primary text-primary-foreground text-[15px] font-medium px-5 py-3.5 rounded-2xl rounded-tr-none shadow-sm leading-relaxed">
                        {m.parts ? m.parts.map((part: any, i: number) => part.type === "text" ? part.text : null) : m.content}
                      </div>
                      <div className="flex items-center justify-end gap-1.5 px-1">
                        <span className="text-xs text-muted-foreground">
                          {new Date(m.createdAt || Date.now()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <CheckCheck size={15} className="text-green-500" />
                      </div>
                    </div>
                    <div className="size-10 rounded-full shrink-0 bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      V
                    </div>
                  </div>
                );
              }

              return (
                <div key={m.id || index} className="flex items-end gap-3 self-start w-full pr-4">
                  <Avatar className={cn("size-10 shrink-0 border", isAdmin ? "border-green-500/30" : "border-border/10")}>
                    <AvatarImage src={kabirouAvatar} className="object-cover" />
                    <AvatarFallback className={cn("text-xs font-bold", isAdmin ? "bg-green-500 text-white" : "bg-primary/10 text-primary")}>
                      KA
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1.5 max-w-[75%]">
                    <div className={cn(
                      "text-[15px] font-medium px-5 py-3.5 rounded-2xl rounded-tl-none shadow-xs border leading-relaxed",
                      isAdmin ? "bg-green-50 border-green-100 text-green-900" : "bg-accent/50 text-secondary-foreground border-border/5"
                    )}>
                      {m.parts ? m.parts.map((part: any, i: number) => part.type === "text" ? part.text : null) : m.content}
                    </div>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(m.createdAt || Date.now()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isAdmin && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">{kabirouName.split(' ')[0]}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex items-end gap-3 self-start">
                <Avatar className="size-10 shrink-0">
                  <AvatarImage src={kabirouAvatar} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">KA</AvatarFallback>
                </Avatar>
                <div className="bg-accent/50 px-5 py-4 rounded-2xl rounded-tl-none flex gap-2 items-center shadow-xs border border-border/5">
                  <span className="size-2 bg-primary/50 rounded-full animate-bounce" />
                  <span className="size-2 bg-primary/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="size-2 bg-primary/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </SheetBody>

          <SheetFooter className="block p-0 sm:space-x-0 border-t border-border">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="p-5 w-full relative">

                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="w-full ps-12 pe-28 py-4 h-auto text-[15px]"
                  disabled={isLoading}
                />
                <div className="absolute end-7 top-1/2 -translate-y-1/2">
                  <Button
                    size="sm"
                    variant="mono"
                    type="submit"
                    disabled={isLoading || !input.trim()}
                  >
                    Envoyer
                  </Button>
                </div>
              </div>
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
