import { educationExperienceData } from "@/data/education";

export default function Education() {
  return (
    <section className="education-experience tmp-section-gapTop">
      <div className="container">
        <h2 className="custom-title mb-32 tmp-scroll-trigger tmp-fade-in animation-order-1">
          Education{" "}
          <span>
            <img
              loading="lazy"
              alt="custom-line"
              width={81}
              height={6}
              src="/assets/images/custom-line/custom-line.png"
            />
          </span>
        </h2>
        <div className="row g-5">
          {educationExperienceData.map((item, index) => (
            <div className="col-lg-6 col-sm-6" key={index}>
              <div
                className={`education-experience-card tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${item.animationOrder}`}
              >
                <h4 className="edu-sub-title">{item.role}</h4>
                <h2 className="edu-title">{item.duration}</h2>
                <p className="edu-para">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="experiences-wrapper v2">
          <div className="row">
            <div className="col-lg-6">
              <div className="experiences-wrap-right-content">
                <img
                  loading="lazy"
                  className="tmp-scroll-trigger tmp-zoom-in animation-order-1"
                  alt="expert-img"
                  width={630}
                  height={479}
                  src="/assets/images/experiences/expert-img-two.jpg"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="experiences-wrap-left-content">
                <h2 className="custom-title mb-32 tmp-scroll-trigger tmp-fade-in animation-order-1">
                  Experiences{" "}
                  <span>
                    <img
                      loading="lazy"
                      alt="custom-line"
                      width={81}
                      height={6}
                      src="/assets/images/custom-line/custom-line.png"
                    />
                  </span>
                </h2>
                <div className="experience-content tmp-scroll-trigger tmp-fade-in animation-order-1">
                  <p className="ex-subtitle">experience</p>
                  <h2 className="ex-name">Fatima Asrafy</h2>
                  <h3 className="ex-title">UI/UX Designer</h3>
                  <p className="ex-para">
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum desi dolore eu fugiat nulla pariatu Duis aute
                    irure
                  </p>
                </div>
                <div className="experience-content tmp-scroll-trigger tmp-fade-in animation-order-2">
                  <p className="ex-subtitle">experience</p>
                  <h2 className="ex-name">Fatima Asrafy</h2>
                  <h3 className="ex-title">UI/UX Designer</h3>
                  <p className="ex-para">
                    Interested in working together? Let’s bring your ideas to
                    life! Contact me, and let’s start building something.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
