"use client";

import { useId, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Affiche une description saisie dans le back-office avec une mise en forme légère :
 * - une ligne vide ou un retour à la ligne commence un nouveau paragraphe ;
 * - une ligne qui reprend par une minuscule est recollée à la précédente
 *   (retour à la ligne accidentel au milieu d'une phrase) ;
 * - une ligne commençant par « - », « • » ou « * » devient une puce ;
 * - dans une puce, « Libellé : texte » met le libellé en gras ;
 * - au-delà de COLLAPSE_AFTER caractères, le texte est replié avec « Lire la suite ».
 */

const COLLAPSE_AFTER = 620;
const BULLET = /^\s*[-•*]\s+/;
// Libellé court avant « : » (pas d'URL ni de phrase entière) ; le séparateur est conservé
const LABEL = /^([^:]{2,60}?)(\s?:\s+)([\s\S]+)$/;

type Block = { kind: "p"; text: string } | { kind: "ul"; items: string[] };

function parse(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.replace(/\r/g, "").split("\n")) {
    const line = raw.trim();
    const last = blocks[blocks.length - 1];
    if (!line) continue;

    if (BULLET.test(line)) {
      const item = line.replace(BULLET, "");
      if (last?.kind === "ul") last.items.push(item);
      else blocks.push({ kind: "ul", items: [item] });
      continue;
    }

    // Suite de phrase (commence par une minuscule) : on recolle au bloc précédent
    if (last && /^\p{Ll}/u.test(line)) {
      if (last.kind === "p") last.text += ` ${line}`;
      else last.items[last.items.length - 1] += ` ${line}`;
      continue;
    }

    blocks.push({ kind: "p", text: line });
  }
  return blocks;
}

function Item({ text }: { text: string }) {
  const m = text.match(LABEL);
  if (!m || /https?:\/\//.test(m[1])) return <li>{text}</li>;
  return (
    <li>
      <strong>{m[1]}</strong>
      {m[2]}
      {m[3]}
    </li>
  );
}

export default function RichDescription({ text }: { text: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const id = useId();
  const blocks = parse(text);
  const collapsible = text.length > COLLAPSE_AFTER;

  return (
    <div className="kb-desc">
      <div
        id={id}
        className={`kb-desc-body${collapsible && !open ? " is-collapsed" : ""}`}
      >
        {blocks.map((b, i) =>
          b.kind === "p" ? (
            <p key={i}>{b.text}</p>
          ) : (
            <ul key={i} className="kb-desc-list">
              {b.items.map((it, j) => (
                <Item key={j} text={it} />
              ))}
            </ul>
          )
        )}
      </div>
      {collapsible && (
        <button
          type="button"
          className="kb-desc-toggle"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? t("resume.read_less") : t("resume.read_more")}
          <i className={`fa-solid fa-chevron-${open ? "up" : "down"}`} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
