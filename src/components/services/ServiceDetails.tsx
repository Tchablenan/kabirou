type ServiceItem = {
  title: string;
  // Add other properties as needed
};

interface ServiceDetailsProps {
  serviceItem: ServiceItem;
}

export default function ServiceDetails({ serviceItem }: ServiceDetailsProps) {
  return (
    <div className="service-details-area-wrapper tmp-section-gap">
      <div className="container">
        <div className="row row--40">
          <div className="col-lg-8">
            <div className="service-thumnail-wrap">
              <img
                loading="lazy"
                alt="thumnail-img"
                src="/assets/images/services/service-detials-thumnail-wrap.png"
                width={850}
                height={476}
              />
            </div>
            <h2 className="title split-collab">{serviceItem.title}</h2>
            <p className="doc-para">
              Web designing in a powerful way of just not an only professions,
              however, in a passion for our Company. We have to a tendency to
              believe the idea that smart looking of any websitet in on
              visitors.Web designing in a powerful way of just not an only
              profession Web designing in a powerful way of just not an only
            </p>
            <h2 className="title-mini split-collab">
              My Experts Areas where i gained skill
            </h2>
            <p className="doc-para">
              Web designing in a powerful way of just not an only professions,
              however, in a passion for our Company. We have to a tendency to
              believe the idea that smart looking of any websitet in on
              visitors.Web designing in a powerful way of just not an only
              profession Web designing in a powerful way of just not an only
            </p>
            <p className="doc-para">
              Aliquam eros justo, posuere loborti viverra laoreet matti
              ullamcorper posuere viverra .Aliquam eros justo, posuere lobortis,
              viverra laoreet augue mattis fermentum ullamcorper viverra laoreet
              Aliquam eros
            </p>
            <h2 className="title-mini split-collab">
              My Experts Areas where i gained skill
            </h2>
            <p className="doc-para">
              Web designing in a powerful way of just not an only professions,
              however, in a passion for our Company. We have to a tendency to
              believe the idea that smart looking of any websitet in on
              visitors.Web designing in a powerful way of just not an only
              profession Web designing in a powerful way of just not an only
            </p>
            <p className="doc-para">
              Aliquam eros justo, posuere loborti viverra laoreet matti
              ullamcorper posuere viverra .Aliquam eros justo, posuere lobortis,
              viverra laoreet augue mattis fermentum ullamcorper viverra laoreet
              Aliquam eros
            </p>
            <p className="doc-para">
              viverra laoreet matti ullamcorper posuere viverra .Aliquam eros
              justo, posuere lobortis, viverra laoreet augue mattis fermentum
              ullamcorper viverra laoreet Aliquam eros
            </p>
          </div>
          <div className="col-lg-4">
            <div className="signle-side-bar service-list-area tmponhover">
              <div className="header">
                <h3 className="title">Service Category</h3>
              </div>
              <div className="body">
                <a href="#" className="single-service">
                  <p className="service-title">TechPros</p>
                  <span className="service-icon">
                    <i className="fa-solid fa-angle-right" />
                  </span>
                </a>
                <a href="#" className="single-service">
                  <p className="service-title">NetWorks</p>
                  <span className="service-icon">
                    <i className="fa-solid fa-angle-right" />
                  </span>
                </a>
                <a href="#" className="single-service">
                  <p className="service-title">DataMasters</p>
                  <span className="service-icon">
                    <i className="fa-solid fa-angle-right" />
                  </span>
                </a>
                <a href="#" className="single-service">
                  <p className="service-title">Dibetics section</p>
                  <span className="service-icon">
                    <i className="fa-solid fa-angle-right" />
                  </span>
                </a>
                <a href="#" className="single-service">
                  <p className="service-title">DigitalSolutions</p>
                  <span className="service-icon">
                    <i className="fa-solid fa-angle-right" />
                  </span>
                </a>
                <a href="#" className="single-service">
                  <p className="service-title">CodeGenius</p>
                  <span className="service-icon">
                    <i className="fa-solid fa-angle-right" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
