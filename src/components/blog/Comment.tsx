"use client";

import React from "react";
import { useTranslation } from "react-i18next";

const Comment: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="comment-form-area mt--40">
      <h3 className="title split-collab">Leave a Reply</h3>
      <form className="comment-form" action="#">
        <div className="row g-5">
          <div className="col-lg-6">
            <div className="form-group">
              <input type="text" placeholder="Name" required />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="form-group">
              <input type="email" placeholder="Email" required />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="form-group">
              <textarea placeholder="Message" required defaultValue={""} />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="tmp-button-here">
              <button
                className="tmp-btn hover-icon-reverse radius-round w-100"
                type="submit"
              >
                <span className="icon-reverse-wrapper">
                  <span className="btn-text">Post Comment</span>
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
  );
};

export default Comment;
