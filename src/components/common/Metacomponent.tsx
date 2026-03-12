"use client";

// import { Helmet, HelmetProvider } from "react-helmet-async";

import { useEffect } from "react";

type MetaProps = {
  meta: {
    title: string;
    description?: string;
  };
};

export default function MetaComponent({ meta }: MetaProps) {
  useEffect(() => {
    const updateMeta = async () => {
      document.title = meta.title;
    };
    updateMeta();
    return () => {
      document.title = "Kabirou Djantchiemo | Web & Mobile Developer";
    };
  }, [meta.title]);
  return (
    // <HelmetProvider>
    //   <Helmet>
    //     <title>{meta?.title}</title>
    //     <meta name="description" content={meta?.description} />
    //   </Helmet>
    // </HelmetProvider>

    <></>
  );
}
