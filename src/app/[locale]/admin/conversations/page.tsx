"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { 
  getCoreRowModel, 
  useReactTable, 
  ColumnDef 
} from '@tanstack/react-table';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  ArrowLeft, 
  Eye, 
  User as UserIcon, 
  Mail, 
  Phone,
  Clock
} from "lucide-react";
import { 
  DataGrid, 
  DataGridContainer 
} from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ChatSheet, ChatMessage } from "@/components/layouts/layout-1/shared/topbar/chat-sheet";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Sheet } from "@/components/ui/sheet";

interface Conversation {
  id: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  status: string;
  messageCount: number;
  lastMessage: string;
  updatedAt: string;
}

export default function AdminConversations() {
  const { status } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // States for viewing a conversation
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchConversations();
    }
  }, [status]);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/admin/conversations");
      const data = await res.json();
      setConversations(data.data || []);
    } catch (error) {
      toast.error("Erreur lors du chargement des conversations");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (id: string) => {
    setIsLoadingMessages(true);
    try {
      const res = await fetch(`/api/chat/history?conversationId=${id}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      toast.error("Erreur lors du chargement des messages");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleOpenConversation = (id: string) => {
    setSelectedId(id);
    fetchMessages(id);
  };

  const columns = useMemo<ColumnDef<Conversation>[]>(() => [
    {
      accessorKey: 'visitorName',
      header: 'Visiteur',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <UserIcon className="size-3.5 text-muted-foreground" />
            {row.original.visitorName}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Mail className="size-3.5" />
            {row.original.visitorEmail}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'lastMessage',
      header: 'Dernier Message',
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate italic text-muted-foreground">
          "{row.original.lastMessage}"
        </div>
      ),
    },
    {
      accessorKey: 'messageCount',
      header: 'Messages',
      cell: ({ row }) => (
        <Badge variant="outline" className="font-bold">
          {row.original.messageCount} msg
        </Badge>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Dernière activité',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Clock className="size-3.5" />
          {formatDistanceToNow(new Date(row.original.updatedAt), { addSuffix: true, locale: fr })}
        </span>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right pr-4">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end pr-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={() => handleOpenConversation(row.original.id)}
          >
            <Eye className="size-4" />
            Visualiser
          </Button>
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data: conversations,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedConversation = conversations.find(c => c.id === selectedId);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Chargement des conversations...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-7.5 w-full">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <MessageSquare className="size-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Messages Visiteurs</h2>
            <p className="text-sm text-muted-foreground">Gérez les interactions directes avec vos visiteurs.</p>
          </div>
        </div>
        <Button onClick={() => router.push("/admin/dashboard")} variant="outline" size="sm" className="gap-2">
          <ArrowLeft className="size-4" />
          Retour
        </Button>
      </div>

      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle className="text-lg">Historique des échanges</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataGridContainer border={false}>
            <DataGrid 
              table={table} 
              recordCount={conversations.length}
              tableLayout={{ width: 'fixed', rowBorder: true }}
            >
              <DataGridTable />
            </DataGrid>
          </DataGridContainer>
        </CardContent>
      </Card>

      {/* Chat Preview Modal/Sheet */}
      <Sheet open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        {selectedId && (
          <ChatSheet 
            title={`Conversation avec ${selectedConversation?.visitorName || "Anonyme"}`}
            messages={messages}
            isLoading={isLoadingMessages}
            visitorInfo={{
              name: selectedConversation?.visitorName,
              email: selectedConversation?.visitorEmail,
              phone: selectedConversation?.visitorPhone,
            }}
            isReadOnly={false}
            onSendMessage={async (content) => {
              try {
                const res = await fetch(`/api/admin/conversations/${selectedId}/reply`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ content }),
                });
                if (res.ok) {
                  const newMessage = await res.json();
                  setMessages(prev => [...prev, newMessage]);
                  fetchConversations(); // Refresh last message in list
                }
              } catch (error) {
                toast.error("Erreur lors de l'envoi de la réponse");
              }
            }}
          />
        )}
      </Sheet>
    </div>
  );
}
