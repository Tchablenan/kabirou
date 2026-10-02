"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useProfile } from "@/hooks/useProfile";

// Messagerie en direct : le visiteur écrit, Kabirou répond depuis l'admin.
// Les messages sont stockés via /api/chat et relus via /api/chat/history.

type ChatRole = "user" | "admin";

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: string;
  pending?: boolean;
}

const STORAGE_KEY = "chat_conversation_id";
const STARTED_KEY = "chat_started";
const SEEN_KEY = "chat_seen_replies";
const DISMISSED_KEY = "chat_contact_dismissed";
const POLL_OPEN_MS = 5000;
const POLL_CLOSED_MS = 60000;
const MAX_LENGTH = 2000;

function getConversationId(): string {
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function readStorage(key: string, storage: "local" | "session" = "local") {
  try {
    return (storage === "local" ? localStorage : sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string, storage: "local" | "session" = "local") {
  try {
    (storage === "local" ? localStorage : sessionStorage).setItem(key, value);
  } catch {
    // Stockage indisponible (navigation privée stricte) : sans conséquence
  }
}

function formatTime(iso: string, locale: string) {
  return new Date(iso).toLocaleTimeString(locale === "en" ? "en-GB" : "fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Chat() {
  const { t, i18n } = useTranslation();
  const { profile } = useProfile();
  const locale = i18n.language || "fr";

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  // Une conversation existe déjà pour ce navigateur (au moins un message envoyé)
  const [hasStarted, setHasStarted] = useState(false);
  // Nombre de réponses de Kabirou déjà vues, pour la pastille « nouveau message »
  const [seenReplies, setSeenReplies] = useState(0);

  // Carte « laissez vos coordonnées »
  const [hasContact, setHasContact] = useState(true);
  const [contactDismissed, setContactDismissed] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactValue, setContactValue] = useState("");
  const [contactError, setContactError] = useState("");
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [contactSaved, setContactSaved] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const firstName = profile?.name?.split(" ")[0] || "Kabirou";
  const fullName = profile?.name || "Kabirou Djantchiemo";
  const avatar = profile?.image || "/assets/images/kbi/df-scaled.webp";

  useEffect(() => {
    setMounted(true);
    setConversationId(getConversationId());
    setHasStarted(readStorage(STARTED_KEY) === "1");
    setSeenReplies(Number(readStorage(SEEN_KEY)) || 0);
    setContactDismissed(readStorage(DISMISSED_KEY, "session") === "1");
  }, []);

  const fetchHistory = useCallback(async () => {
    if (!conversationId) return;
    try {
      const res = await fetch(`/api/chat/history?conversationId=${encodeURIComponent(conversationId)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data.messages)) return;
      setHasContact(Boolean(data.hasContact));
      setMessages((current) => {
        // Garde les messages en cours d'envoi tant que le serveur ne les a pas renvoyés
        const pending = current.filter((m) => m.pending);
        return [...data.messages, ...pending];
      });
    } catch {
      // Réseau indisponible : on réessaiera au prochain intervalle
    }
  }, [conversationId]);

  // Historique à l'ouverture, puis rafraîchissement tant que le panneau est ouvert et visible
  useEffect(() => {
    if (!isOpen) return;
    fetchHistory();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") fetchHistory();
    }, POLL_OPEN_MS);
    return () => clearInterval(interval);
  }, [isOpen, fetchHistory]);

  // Panneau fermé : vérifie de temps en temps si Kabirou a répondu (seulement si une conversation existe)
  useEffect(() => {
    if (isOpen || !hasStarted) return;
    fetchHistory();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") fetchHistory();
    }, POLL_CLOSED_MS);
    return () => clearInterval(interval);
  }, [isOpen, hasStarted, fetchHistory]);

  const replyCount = messages.filter((m) => m.role === "admin").length;
  const unread = Math.max(replyCount - seenReplies, 0);

  // Panneau ouvert : toutes les réponses affichées sont considérées comme lues
  useEffect(() => {
    if (!isOpen || replyCount === seenReplies) return;
    setSeenReplies(replyCount);
    writeStorage(SEEN_KEY, String(replyCount));
  }, [isOpen, replyCount, seenReplies]);

  useEffect(() => {
    document.body.classList.toggle("chat-open", isOpen);
    if (isOpen) inputRef.current?.focus();
    return () => document.body.classList.remove("chat-open");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, isOpen]);

  const send = async (e?: FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isSending || !conversationId) return;

    const tempId = `pending-${Date.now()}`;
    setMessages((m) => [...m, { id: tempId, role: "user", text, createdAt: new Date().toISOString(), pending: true }]);
    setInput("");
    setError("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, content: text }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages((m) => m.map((msg) => (msg.id === tempId ? { ...data.message } : msg)));
      if (!hasStarted) {
        setHasStarted(true);
        writeStorage(STARTED_KEY, "1");
      }
    } catch {
      setMessages((m) => m.filter((msg) => msg.id !== tempId));
      setInput(text);
      setError(t("chat.error"));
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const saveContact = async (e: FormEvent) => {
    e.preventDefault();
    const contact = contactValue.trim();
    if (!contact || isSavingContact) return;
    setContactError("");
    setIsSavingContact(true);
    try {
      const res = await fetch("/api/chat/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, name: contactName, contact }),
      });
      if (res.status === 400) {
        setContactError(t("chat.contact_invalid"));
        return;
      }
      if (!res.ok) throw new Error();
      setHasContact(true);
      setContactSaved(true);
    } catch {
      setContactError(t("chat.error"));
    } finally {
      setIsSavingContact(false);
    }
  };

  const dismissContact = () => {
    setContactDismissed(true);
    writeStorage(DISMISSED_KEY, "1", "session");
  };

  if (!mounted) return null;

  const hasUserMessage = messages.some((m) => m.role === "user");

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`kb-chat-trigger ${isOpen ? "is-hidden" : ""}`}
        onClick={() => setIsOpen(true)}
        aria-label={t("chat.open")}
        aria-expanded={isOpen}
        aria-controls="kb-chat-panel"
      >
        <i className="fa-solid fa-comment-dots" aria-hidden="true" />
        {unread > 0 && (
          <span className="kb-chat-badge" aria-label={t("chat.unread", { count: unread })}>
            {unread}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          id="kb-chat-panel"
          className="kb-chat-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="kb-chat-title"
        >
          <div className="kb-chat-header">
            <div className="kb-chat-avatar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatar} alt="" width={44} height={44} />
              <span className="kb-chat-online" aria-hidden="true" />
            </div>
            <div className="kb-chat-identity">
              <span id="kb-chat-title" className="kb-chat-name">{fullName}</span>
              <span className="kb-chat-status">{t("chat.status")}</span>
            </div>
            <button
              type="button"
              className="kb-chat-close"
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label={t("chat.close")}
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>

          <div className="kb-chat-messages" ref={listRef} aria-live="polite">
            <div className="kb-chat-row is-admin">
              <div className="kb-chat-bubble">{t("chat.welcome", { name: firstName })}</div>
            </div>

            {messages.map((m) => (
              <div key={m.id} className={`kb-chat-row ${m.role === "user" ? "is-user" : "is-admin"}`}>
                <div className={`kb-chat-bubble ${m.pending ? "is-pending" : ""}`}>{m.text}</div>
                <span className="kb-chat-meta">
                  {m.role === "admin" && <strong>{firstName} · </strong>}
                  {formatTime(m.createdAt, locale)}
                  {m.role === "user" && !m.pending && (
                    <i className="fa-solid fa-check-double" aria-label={t("chat.sent")} />
                  )}
                </span>
              </div>
            ))}

            {hasUserMessage && !messages.some((m) => m.role === "admin") && (
              <p className="kb-chat-notice">{t("chat.notified", { name: firstName })}</p>
            )}

            {hasUserMessage && !hasContact && !contactDismissed && (
              <form className="kb-chat-contact" onSubmit={saveContact}>
                <p className="kb-chat-contact-text">{t("chat.contact_prompt")}</p>
                <input
                  type="text"
                  className="kb-chat-field"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder={t("chat.contact_name")}
                  aria-label={t("chat.contact_name")}
                  autoComplete="name"
                  maxLength={100}
                />
                <input
                  type="text"
                  className="kb-chat-field"
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder={t("chat.contact_value")}
                  aria-label={t("chat.contact_value")}
                  autoComplete="email"
                  maxLength={200}
                  required
                />
                {contactError && (
                  <p className="kb-chat-contact-error" role="alert">
                    {contactError}
                  </p>
                )}
                <div className="kb-chat-contact-actions">
                  <button type="button" className="kb-chat-link" onClick={dismissContact}>
                    {t("chat.contact_later")}
                  </button>
                  <button type="submit" className="kb-chat-contact-submit" disabled={!contactValue.trim() || isSavingContact}>
                    {t("chat.contact_save")}
                  </button>
                </div>
              </form>
            )}

            {contactSaved && (
              <p className="kb-chat-notice is-success">
                {t("chat.contact_thanks", { name: firstName })}
              </p>
            )}
          </div>

          {error && (
            <p className="kb-chat-error" role="alert">
              {error}
            </p>
          )}

          <form className="kb-chat-form" onSubmit={send}>
            <textarea
              ref={inputRef}
              className="kb-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, MAX_LENGTH))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={t("chat.placeholder")}
              aria-label={t("chat.placeholder")}
              rows={1}
            />
            <button
              type="submit"
              className="kb-chat-send"
              disabled={!input.trim() || isSending}
              aria-label={t("chat.send")}
            >
              <i className="fa-solid fa-paper-plane" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
