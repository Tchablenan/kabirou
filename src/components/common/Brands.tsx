import { companyLogos } from "@/data/brands";

export default function Brands({
  parentClass = "our-supported-company-area tmp-section-gapTop",
}) {
  return (
    <div className={parentClass} id="clients">
      <div className="container">
        <div className="row justify-content-center">
          {companyLogos.map((logo, index) => (
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6" key={index}>
              <div
                className={`support-company-logo tmp-scroll-trigger tmp-fade-in animation-order-${logo.animationOrder}`}
              >
                <img
                  loading="lazy"
                  alt="Reeni - Personal Portfolio HTML Template"
                  src={logo.src}
                  width={logo.width}
                  height={logo.height}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
