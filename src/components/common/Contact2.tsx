"use client";

import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function Contact({
  parentClass = "get-in-touch-area tmp-section-gapTop",
}) {
  const { t } = useTranslation();
  const form = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const sandMail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(form.current!);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    // Simple client-side validation
    if (!name || !email || !subject || !message) {
      toast.error(t("contact.error_fill_all"));
      return;
    }

    if (!validateEmail(email)) {
      toast.error(t("contact.error_invalid_email"));
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (response.ok) {
        toast.success(t("contact.success_message"));
        form.current?.reset();
      } else {
        const data = await response.json();
        console.error('Submission error:', data.error);
        toast.error(t("contact.error_failed"));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("contact.error_occurred"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={parentClass} id="contacts">
      <div className="container">
        <div className="contact-get-in-touch-wrap">
          <div className="get-in-touch-wrapper tmponhover">
            <div className="row g-5 align-items-center">
              <div className="col-lg-5">
                <div className="section-head text-align-left">
                  <div className="section-sub-title tmp-scroll-trigger tmp-fade-in animation-order-1">
                    <span className="subtitle">{t("contact.subtitle")}</span>
                  </div>
                  <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">
                    {t("contact.title")}
                  </h2>
                  <p className="description tmp-scroll-trigger tmp-fade-in animation-order-3">
                    {t("contact.description")}
                  </p>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="contact-inner">
                  <div className="contact-form">
                    <div id="form-messages" className="error" />
                    <form
                      className="tmp-dynamic-form"
                      id="contact-form"
                      ref={form}
                      onSubmit={sandMail}
                    >
                      <div className="contact-form-wrapper row">
                        <div className="col-lg-6">
                          <div className="form-group">
                            <input
                              className="input-field"
                              name="name"
                              id="contact-name"
                              placeholder={t("contact.name")}
                              type="text"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <input
                              className="input-field"
                              id="contact-email"
                              name="email"
                              placeholder={t("contact.email")}
                              type="email"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <input
                              className="input-field"
                              type="text"
                              id="subject"
                              required
                              name="subject"
                              placeholder={t("contact.subject")}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-group">
                            <textarea
                              className="input-field"
                              placeholder={t("contact.message")}
                              name="message"
                              id="contact-message"
                              required
                              defaultValue={""}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="tmp-button-here">
                            <button
                              className="tmp-btn hover-icon-reverse radius-round w-100"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              <span className="icon-reverse-wrapper">
                                <span className="btn-text">
                                  {isSubmitting
                                    ? t("contact.sending")
                                    : t("contact.button")}
                                </span>
                                <span className="btn-icon">
                                  <i className="fa-sharp fa-regular fa-arrow-right" />
                                </span>
                                <span className="btn-icon">
                                  <i className="fa-sharp fa-regular fa-arrow-right" />
                                </span>
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
