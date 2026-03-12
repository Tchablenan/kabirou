import Link from "next/link";
import { useModalUI } from "@/context/ModalUIContext";

export default function Sidebar() {
  const { openModals, closeModal } = useModalUI();
  return (
    <div className="d-none d-xl-block">
      <div
        className={`tmp-sidebar-area tmp_side_bar ${
          openModals.sidebar ? "tmp_side_bar_open" : ""
        }`}
      >
        <div className="inner">
          <div className="top-area">
            <Link href="/" className="logo">
              <img
                loading="lazy"
                className="logo-dark"
                alt="Reeni - Personal Portfolio HTML Template for developers and freelancers"
                src="/assets/images/logo/white-logo-reeni.png"
                width={121}
                height={41}
              />
              <img
                loading="lazy"
                className="logo-white"
                alt="Reeni - Personal Portfolio HTML Template for developers and freelancers"
                src="/assets/images/logo/logo-white.png"
                width={121}
                height={40}
              />
            </Link>
            <div className="close-icon-area">
              <button
                className="tmp-round-action-btn close_side_menu_active"
                onClick={() => closeModal("sidebar")}
              >
                <i className="fa-sharp fa-light fa-xmark" />
              </button>
            </div>
          </div>
          <div className="content-wrapper">
            <div className="image-area-feature">
              <Link href="/">
                <img
                  loading="lazy"
                  alt="personal-logo"
                  src="/assets/images/logo/man.png"
                  width={340}
                  height={196}
                />
              </Link>
            </div>
            <h5 className="title mt--30">
              Freelancer delivering exceptional Webflow, and Next.js solutions.
            </h5>
            <p className="disc">
              I am a skilled freelancer specializing in Webflow development,
              Figma design, and Next.js projects. I deliver creative, dynamic,
              and user-centric web solutions.
            </p>
            <div className="short-contact-area">
              {/* single contact information */}
              <div className="single-contact">
                <i className="fa-solid fa-phone" />
                <div className="information tmp-link-animation">
                  <span>Call Now</span>
                  <a href="#" className="number">
                    +92 (8800) - 98670
                  </a>
                </div>
              </div>
              {/* single contact information end */}
              {/* single contact information */}
              <div className="single-contact">
                <i className="fa-solid fa-envelope" />
                <div className="information tmp-link-animation">
                  <span>Mail Us</span>
                  <a href="#" className="number">
                    example@info.com
                  </a>
                </div>
              </div>
              {/* single contact information end */}
              {/* single contact information */}
              <div className="single-contact">
                <i className="fa-solid fa-location-crosshairs" />
                <div className="information tmp-link-animation">
                  <span>My Address</span>
                  <span className="number">66 Broklyant, New York 3269</span>
                </div>
              </div>
              {/* single contact information end */}
            </div>
            {/* social area start */}
            <div className="social-wrapper mt--20">
              <span className="subtitle">find with me</span>
              <div className="social-link">
                <a href="#">
                  <i className="fa-brands fa-instagram" />
                </a>
                <a href="#">
                  <i className="fa-brands fa-linkedin-in" />
                </a>
                <a href="#">
                  <i className="fa-brands fa-twitter" />
                </a>
                <a href="#">
                  <i className="fa-brands fa-facebook-f" />
                </a>
              </div>
            </div>
            {/* social area end */}
          </div>
        </div>
      </div>
      <a
        className="overlay_close_side_menu close_side_menu_active"
        onClick={() => closeModal("sidebar")}
        href="#"
      />
    </div>
  );
}
