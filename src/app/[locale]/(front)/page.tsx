"use client";

import Header3 from "@/components/headers/Header3";
import Hero from "@/components/homes/home-7/Hero";
import Skills from "@/components/common/Skills";
import Services6 from "@/components/common/Services6";
import Education2 from "@/components/common/Education2";
import Portfolio2 from "@/components/common/Portfolio2";
import Blogs3 from "@/components/common/Blogs3";
import Contact2 from "@/components/common/Contact2";
import Footer1 from "@/components/footers/Footer1";
import Copyright from "@/components/footers/Copyright";
import Header5 from "@/components/headers/Header5";
import React from "react";

export default function HomePage7() {
  return (
    <div className="page-with-left-header">
      <Header3 />
      <Header5 />
      <div className="dashboard-style-header index-seven">
        <Hero />
        <Skills />
        <Services6 />
        <Education2 />
        <Portfolio2 />
        <Blogs3 />
        <Contact2 />
        <Footer1 />
        <Copyright />
      </div>
    </div>
  );
}
