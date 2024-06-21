// import LeafLetMap from "@/components/LeafLetMap";
// import HomePage from "@/components/LeafLetMap";
import MapComponent from "@/components/LeafLetMap";
import App from "next/app";
import dynamic from "next/dynamic";

const HomePage = dynamic(() => import("@/components/LeafLetMap"), {
  ssr: false,
});
import { Suspense } from "react";

const LeafLet = () => {
  return (
    <Suspense>
      <HomePage />
    </Suspense>
  );
};
export default LeafLet;
