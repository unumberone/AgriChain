// @route -> /
import Header from "../components/home/Header";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import DashboardPreview from "../components/home/DashboardPreview";
import Footer from "../components/home/Footer";

export default function Home() {
    return (
        <div>
            {/* Header */}
            <Header/>

            {/* Hero Section */}
            <Hero />

            {/* Features Section */}
            <Features />
            
            {/* Dahsboard Preview */}
            <DashboardPreview />

            {/* Footer */}
            <Footer />
        </div>
    );
}